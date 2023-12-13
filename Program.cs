using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.IO;

namespace OcelotApiGateway
{
    public class Program
    {
        public static void Main(string[] args)
        {
            new WebHostBuilder()
            .UseKestrel()
            .UseContentRoot(Directory.GetCurrentDirectory())
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                config
                    .AddJsonFile("ocelot.json")
                    .AddEnvironmentVariables();
            })
            .ConfigureServices(s => {
                s.AddHttpClient();
                s.AddOcelot();
                s.AddSingleton<JwtValidationMiddleware>();
            })
            .UseIISIntegration()
            .Configure(app =>
            {
                app.UseMiddleware<JwtValidationMiddleware>();
                app.UseOcelot().Wait();
            })
            .Build()
            .Run();
        }
    }
}