FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# It's important to keep lines from here down to "COPY . ." identical in all Dockerfiles
# to take advantage of Docker's build cache, to speed up local container builds
COPY "DMSpro.OMS.sln" "DMSpro.OMS.sln"

# Applications
COPY "apps/auth-server/src/DMSpro.OMS.AuthServer/DMSpro.OMS.AuthServer.csproj" "apps/auth-server/src/DMSpro.OMS.AuthServer/DMSpro.OMS.AuthServer.csproj"
COPY "apps/public-web/src/DMSpro.OMS.PublicWeb/DMSpro.OMS.PublicWeb.csproj" "apps/public-web/src/DMSpro.OMS.PublicWeb/DMSpro.OMS.PublicWeb.csproj"
COPY *"apps/blazor/src/DMSpro.OMS.Blazor/DMSpro.OMS.Blazor.csproj" "apps/blazor/src/DMSpro.OMS.Blazor/DMSpro.OMS.Blazor.csproj"
COPY *"apps/blazor/src/DMSpro.OMS.Blazor.Server/DMSpro.OMS.Blazor.Server.csproj" "apps/blazor/src/DMSpro.OMS.Blazor.Server/DMSpro.OMS.Blazor.Server.csproj"
COPY *"apps/web/src/DMSpro.OMS.Web/DMSpro.OMS.Web.csproj" "apps/web/src/DMSpro.OMS.Web/DMSpro.OMS.Web.csproj"

# Shared Projects
COPY "shared/DMSpro.OMS.DbMigrator/DMSpro.OMS.DbMigrator.csproj" "shared/DMSpro.OMS.DbMigrator/DMSpro.OMS.DbMigrator.csproj"
COPY "shared/DMSpro.OMS.Shared.Hosting/DMSpro.OMS.Shared.Hosting.csproj" "shared/DMSpro.OMS.Shared.Hosting/DMSpro.OMS.Shared.Hosting.csproj"
COPY "shared/DMSpro.OMS.Shared.Hosting.Gateways/DMSpro.OMS.Shared.Hosting.Gateways.csproj" "shared/DMSpro.OMS.Shared.Hosting.Gateways/DMSpro.OMS.Shared.Hosting.Gateways.csproj"
COPY "shared/DMSpro.OMS.Shared.Hosting.Microservices/DMSpro.OMS.Shared.Hosting.Microservices.csproj" "shared/DMSpro.OMS.Shared.Hosting.Microservices/DMSpro.OMS.Shared.Hosting.Microservices.csproj"
COPY "shared/DMSpro.OMS.Shared.Hosting.AspNetCore/DMSpro.OMS.Shared.Hosting.AspNetCore.csproj" "shared/DMSpro.OMS.Shared.Hosting.AspNetCore/DMSpro.OMS.Shared.Hosting.AspNetCore.csproj"
COPY "shared/DMSpro.OMS.Shared.Hosting/DMSpro.OMS.Shared.Hosting.csproj" "shared/DMSpro.OMS.Shared.Hosting/DMSpro.OMS.Shared.Hosting.csproj"
COPY "shared/DMSpro.OMS.Shared.Localization/DMSpro.OMS.Shared.Localization.csproj" "shared/DMSpro.OMS.Shared.Localization/DMSpro.OMS.Shared.Localization.csproj"

# Microservices
COPY "services/administration/src/DMSpro.OMS.AdministrationService.HttpApi.Host/DMSpro.OMS.AdministrationService.HttpApi.Host.csproj" "services/administration/src/DMSpro.OMS.AdministrationService.HttpApi.Host/DMSpro.OMS.AdministrationService.HttpApi.Host.csproj"
COPY "services/identity/src/DMSpro.OMS.IdentityService.HttpApi.Host/DMSpro.OMS.IdentityService.HttpApi.Host.csproj" "services/identity/src/DMSpro.OMS.IdentityService.HttpApi.Host/DMSpro.OMS.IdentityService.HttpApi.Host.csproj"
COPY "services/saas/src/DMSpro.OMS.SaasService.HttpApi.Host/DMSpro.OMS.SaasService.HttpApi.Host.csproj" "services/saas/src/DMSpro.OMS.SaasService.HttpApi.Host/DMSpro.OMS.SaasService.HttpApi.Host.csproj"
COPY "services/product/src/DMSpro.OMS.ProductService.HttpApi.Host/DMSpro.OMS.ProductService.HttpApi.Host.csproj" "services/product/src/DMSpro.OMS.ProductService.HttpApi.Host/DMSpro.OMS.ProductService.HttpApi.Host.csproj"
# Gateways
COPY "gateways/web/src/DMSpro.OMS.WebGateway/DMSpro.OMS.WebGateway.csproj" "gateways/web/src/DMSpro.OMS.WebGateway/DMSpro.OMS.WebGateway.csproj"
COPY "gateways/web-public/src/DMSpro.OMS.PublicWebGateway/DMSpro.OMS.PublicWebGateway.csproj" "gateways/web-public/src/DMSpro.OMS.PublicWebGateway/DMSpro.OMS.PublicWebGateway.csproj"

COPY "NuGet.Config" "NuGet.Config"

RUN dotnet restore "DMSpro.OMS.sln"

COPY . .
WORKDIR "/src/apps/web/src/DMSpro.OMS.Web"
RUN dotnet publish -c Release -o /app
# Should be used after .net6 is out of preview for better performance
# RUN dotnet publish --no-restore -c Release -o /app

FROM build AS publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "DMSpro.OMS.Web.dll"]