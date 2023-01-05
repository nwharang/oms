using System;
using System.IO;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using DMSpro.OMS.AdministrationService;
using DMSpro.OMS.AdministrationService.Web;
using DMSpro.OMS.IdentityService;
using DMSpro.OMS.IdentityService.Web;
using DMSpro.OMS.Localization;
using DMSpro.OMS.ProductService;
using DMSpro.OMS.ProductService.Web;
using DMSpro.OMS.SurveyService;
using DMSpro.OMS.SurveyService.Web;
using DMSpro.OMS.OrderService;
using DMSpro.OMS.OrderService.Web;

using DMSpro.OMS.MdmService;
using DMSpro.OMS.MdmService.Web;
using DMSpro.OMS.InventoryService;
using DMSpro.OMS.InventoryService.Web;

using DMSpro.OMS.SaasService;
using DMSpro.OMS.SaasService.Web;
using DMSpro.OMS.Shared.Hosting.AspNetCore;
using DMSpro.OMS.Web.Navigation;
using Polly;
using Prometheus;
using StackExchange.Redis;
using Volo.Abp;
using Volo.Abp.Account;
using Volo.Abp.AspNetCore.Authentication.OpenIdConnect;
using Volo.Abp.AspNetCore.Mvc.Client;
using Volo.Abp.AspNetCore.Mvc.Localization;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonX;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonX.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Toolbars;
using Volo.Abp.Caching;
using Volo.Abp.Caching.StackExchangeRedis;
using Volo.Abp.EventBus.RabbitMq;
using Volo.Abp.Http.Client;
using Volo.Abp.Http.Client.Web;
using Volo.Abp.Http.Client.IdentityModel.Web;
using Volo.Abp.LeptonX.Shared;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.UI.Navigation;
using Volo.Abp.UI.Navigation.Urls;
using Volo.Abp.VirtualFileSystem;

using Volo.Abp.Account.Public.Web;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Basic;
using Volo.Abp.Identity;

using Volo.Forms;
using Volo.Forms.Web;
using Volo.Abp.Localization;
using Volo.Abp.Validation;
using Volo.Abp.Validation.Localization;
namespace DMSpro.OMS.Web;

[DependsOn(
    typeof(AbpCachingStackExchangeRedisModule),
    typeof(AbpEventBusRabbitMqModule),
    typeof(AbpAspNetCoreMvcClientModule),
    typeof(AbpAspNetCoreAuthenticationOpenIdConnectModule),
    typeof(AbpHttpClientWebModule),
    typeof(AbpHttpClientIdentityModelWebModule),
    typeof(AbpAspNetCoreMvcUiLeptonXThemeModule),
    typeof(AbpAccountPublicHttpApiClientModule),
    typeof(SaasServiceWebModule),
    typeof(SaasServiceHttpApiClientModule),
    typeof(ProductServiceWebModule),
    typeof(ProductServiceHttpApiClientModule),
    typeof(SurveyServiceWebModule),
    typeof(SurveyServiceHttpApiClientModule),
    typeof(OrderServiceWebModule),
    typeof(OrderServiceHttpApiClientModule),

    typeof(IdentityServiceWebModule),
    typeof(IdentityServiceHttpApiClientModule),
    typeof(AdministrationServiceWebModule),
    typeof(AdministrationServiceHttpApiClientModule),
    typeof(OMSSharedHostingAspNetCoreModule),
    typeof(OMSSharedLocalizationModule),
    typeof(MdmServiceWebModule),
    typeof(MdmServiceHttpApiClientModule),
    typeof(InventoryServiceWebModule),

    typeof(InventoryServiceHttpApiClientModule),
    //typeof(AbpAccountPublicWebModule),
    //typeof(AbpAccountPublicHttpApiClientModule),
    typeof(AbpIdentityHttpApiClientModule),
    typeof(AbpLocalizationModule)

)]

[DependsOn(typeof(AbpAspNetCoreMvcUiBasicThemeModule))]

public class OMSWebModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.PreConfigure<AbpMvcDataAnnotationsLocalizationOptions>(options =>
        {
            options.AddAssemblyResource(
                typeof(OMSResource),
                typeof(OMSWebModule).Assembly
            );
        });

        PreConfigure<AbpHttpClientBuilderOptions>(options =>
        {
            options.ProxyClientBuildActions.Add((remoteServiceName, clientBuilder) =>
            {
                clientBuilder.AddTransientHttpErrorPolicy(policyBuilder =>
                    policyBuilder.WaitAndRetryAsync(
                        4,
                        i => TimeSpan.FromSeconds(Math.Pow(2, i))
                    )
                );
            });
        });
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        //You can disable this setting in production to avoid any potential security risks.
        Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;

        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        Configure<AbpBundlingOptions>(options =>
        {
            options.StyleBundles.Configure(
                LeptonXThemeBundles.Styles.Global,
                bundle =>
                {
                    bundle.AddFiles("/global-styles.css");
                }
            );
        });

        Configure<AbpMultiTenancyOptions>(options =>
        {
            options.IsEnabled = true;
        });

        Configure<AbpDistributedCacheOptions>(options =>
        {
            options.KeyPrefix = "OMS:";
        });

        Configure<AppUrlOptions>(options =>
        {
            options.Applications["MVC"].RootUrl = configuration["App:SelfUrl"];
        });

        context.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = "Cookies";
                options.DefaultChallengeScheme = "oidc";
            })
            .AddCookie("Cookies", options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromDays(365);
            })
            .AddAbpOpenIdConnect("oidc", options =>
            {
                options.Authority = configuration["AuthServer:Authority"];
                options.RequireHttpsMetadata = Convert.ToBoolean(configuration["AuthServer:RequireHttpsMetadata"]);
                options.ResponseType = OpenIdConnectResponseType.CodeIdToken;

                options.ClientId = configuration["AuthServer:ClientId"];
                options.ClientSecret = configuration["AuthServer:ClientSecret"];

                options.SaveTokens = true;
                options.GetClaimsFromUserInfoEndpoint = true;

                options.Scope.Add("roles");
                options.Scope.Add("email");
                options.Scope.Add("phone");
                options.Scope.Add("AccountService");
                options.Scope.Add("IdentityService");
                options.Scope.Add("AdministrationService");
                options.Scope.Add("SaasService");
                options.Scope.Add("ProductService");
                options.Scope.Add("MdmService");
                options.Scope.Add("InventoryService");
                options.Scope.Add("SurveyService");
            });

        if (Convert.ToBoolean(configuration["AuthServer:IsOnK8s"]))
        {
            context.Services.Configure<OpenIdConnectOptions>("oidc", options =>
            {
                options.MetadataAddress = configuration["AuthServer:MetaAddress"].EnsureEndsWith('/') +
                                          ".well-known/openid-configuration";

                var previousOnRedirectToIdentityProvider = options.Events.OnRedirectToIdentityProvider;
                options.Events.OnRedirectToIdentityProvider = async ctx =>
                {
                    // Intercept the redirection so the browser navigates to the right URL in your host
                    ctx.ProtocolMessage.IssuerAddress = configuration["AuthServer:Authority"].EnsureEndsWith('/') +
                                                        "connect/authorize";

                    if (previousOnRedirectToIdentityProvider != null)
                    {
                        await previousOnRedirectToIdentityProvider(ctx);
                    }
                };
                var previousOnRedirectToIdentityProviderForSignOut =
                    options.Events.OnRedirectToIdentityProviderForSignOut;
                options.Events.OnRedirectToIdentityProviderForSignOut = async ctx =>
                {
                    // Intercept the redirection for signout so the browser navigates to the right URL in your host
                    ctx.ProtocolMessage.IssuerAddress = configuration["AuthServer:Authority"].EnsureEndsWith('/') +
                                                        "connect/endsession";

                    if (previousOnRedirectToIdentityProviderForSignOut != null)
                    {
                        await previousOnRedirectToIdentityProviderForSignOut(ctx);
                    }
                };
            });
        }

        var dataProtectionBuilder = context.Services.AddDataProtection().SetApplicationName("OMS");
        var redis = ConnectionMultiplexer.Connect(configuration["Redis:Configuration"]);
        dataProtectionBuilder.PersistKeysToStackExchangeRedis(redis, "OMS-Protection-Keys");

        Configure<AbpNavigationOptions>(options =>
        {
            options.MenuContributors.Add(new OMSMenuContributor(configuration));
        });

        Configure<AbpToolbarOptions>(options =>
        {
            options.Contributors.Add(new OMSToolbarContributor());
        });

        if (hostingEnvironment.IsDevelopment())
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                // options.FileSets.ReplaceEmbeddedByPhysical<ProductServiceWebModule>(Path.Combine(
                //     hostingEnvironment.ContentRootPath,
                //     $"..{Path.DirectorySeparatorChar}..{Path.DirectorySeparatorChar}..{Path.DirectorySeparatorChar}..{Path.DirectorySeparatorChar}services{Path.DirectorySeparatorChar}product{Path.DirectorySeparatorChar}src{Path.DirectorySeparatorChar}DMSpro.OMS.ProductService.Web"));
                options.FileSets.AddEmbedded<OMSWebModule>("DMSpro.OMS.Web");
            });
        }

        Configure<LeptonXThemeOptions>(options =>
        {
            options.DefaultStyle = LeptonXStyleNames.System;
        });
        Configure<AbpLocalizationOptions>(options =>
        {
            //Define a new localization resource (TestResource)
            // options.Resources
            //     .Add<OMSWebResource>("en")
            //     .AddBaseTypes(
            //         typeof(AbpValidationResource)
            //     ).AddVirtualJson("/Localization/OMSWeb");

            // options.DefaultResourceType = typeof(OMSWebResource);
            // options.Resources
            //     .Add<OMSWebResource>("en") //Define the resource by "en" default culture
            //     .AddVirtualJson("/Localization/OMSWeb") //Add strings from virtual json files
            //     .AddBaseTypes(typeof(AbpValidationResource));
            options.Resources
                .Add<OMSWebResource>("en")
                .AddBaseTypes(typeof(AbpValidationResource))
                .AddVirtualJson("/Localization/OMSWeb");
            options.DefaultResourceType = typeof(OMSWebResource);
            });
            
        }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();

        app.Use((ctx, next) =>
        {
            ctx.Request.Scheme = "https";
            return next();
        });

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseAbpRequestLocalization();

        if (!env.IsDevelopment())
        {
            app.UseErrorPage();
        }
        if (env.IsDevelopment())
        {
            app.UseErrorPage();
        }

        app.UseForwardedHeaders(new ForwardedHeadersOptions {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
        });

        app.UseCorrelationId();
        app.UseAbpSecurityHeaders();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseHttpMetrics();
        app.UseAuthentication();
        app.UseMultiTenancy();
        app.UseAbpSerilogEnrichers();
        app.UseAuthorization();
        app.UseConfiguredEndpoints(endpoints =>
        {
            endpoints.MapMetrics();
        });
    }
}