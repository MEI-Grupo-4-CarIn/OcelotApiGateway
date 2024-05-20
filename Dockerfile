FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["OcelotApiGateway.csproj", "."]
COPY ["appsettings.json", "."]
RUN dotnet restore "./OcelotApiGateway.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "OcelotApiGateway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OcelotApiGateway.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=build /src/appsettings.json .
ENTRYPOINT ["dotnet", "OcelotApiGateway.dll"]
