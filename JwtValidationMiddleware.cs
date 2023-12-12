namespace OcelotApiGateway
{
    public class JwtValidationMiddleware
    {
        private readonly OcelotRequestDelegate _next;
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _authMicroserviceUrl;
        private readonly List<string> _openEndpoints = new List<string> { "/api/open/endpoint1", "/api/open/endpoint2" };

        public JwtValidationMiddleware(OcelotRequestDelegate next, IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _next = next;
            _clientFactory = clientFactory;
            _authMicroserviceUrl = configuration["AuthMicroserviceUrl"];
        }

        public async Task Invoke(DownstreamContext context)
        {
            var path = context.HttpContext.Request.Path.Value;

            if (_openEndpoints.Contains(path))
            {
                await _next.Invoke(context);
                return;
            }

            var client = _clientFactory.CreateClient();
            var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                var response = await client.GetAsync($"{_authMicroserviceUrl}/validateToken?token={token}");

                if (response.IsSuccessStatusCode)
                {
                    await _next.Invoke(context);
                }
                else
                {
                    context.HttpContext.Response.StatusCode = 401;
                }
            }
            else
            {
                context.HttpContext.Response.StatusCode = 401;
            }
        }
    }
}