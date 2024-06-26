using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.IO;
using System.Security.Cryptography;

namespace OcelotApiGateway
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

            var config = builder.Build();

            new WebHostBuilder()
            .UseKestrel()
            .UseContentRoot(Directory.GetCurrentDirectory())
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                config
                    .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
            })
            .ConfigureServices(s =>
            {
                s.AddHttpClient();
                s.AddOcelot();
                s.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer("JwtAuthentication", options =>
                    {
                        var rsa = new RSACryptoServiceProvider();
                        rsa.FromXmlString(config["JwtSettings:PublicKey"]);
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = config["JwtSettings:Issuer"],
                            ValidAudience = config["JwtSettings:Audience"],
                            IssuerSigningKey = new RsaSecurityKey(rsa.ExportParameters(false))
                        };
                    });
                s.AddCors(options =>
                {
                    options.AddPolicy("AllowAllOrigins",
                        builder => builder.AllowAnyOrigin()
                                          .AllowAnyMethod()
                                          .AllowAnyHeader());
                });
            })
            .UseIISIntegration()
            .Configure(app =>
            {
                app.UseCors("AllowAllOrigins");
                app.UseAuthentication();
                app.UseOcelot().Wait();
            })
            .Build()
            .Run();
        }
    }
}
