using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace OcelotApiGateway
{
    public class JwtValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _authMicroserviceUrl;
        private readonly List<string> _openEndpoints = new List<string>
        {
            "/api/users/all-users-list"
        };

        public JwtValidationMiddleware(RequestDelegate next, IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _next = next;
            _clientFactory = clientFactory;
            _authMicroserviceUrl = configuration["AuthMicroserviceUrl"];
        }

        public async Task Invoke(HttpContext context)
        {
            var path = context.Request.Path.Value;

            if (_openEndpoints.Contains(path))
            {
                await _next(context);
                return;
            }

            var client = _clientFactory.CreateClient();
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                var response = await client.GetAsync($"{_authMicroserviceUrl}/validateToken?token={token}");

                if (response.IsSuccessStatusCode)
                {
                    await _next(context);
                }
                else
                {
                    context.Response.StatusCode = 401;
                }
            }
            else
            {
                context.Response.StatusCode = 401;
            }
        }
    }
}