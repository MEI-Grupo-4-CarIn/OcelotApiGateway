using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

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