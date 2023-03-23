using System;
using System.Threading.Tasks;
using Localization.Resources.AbpUi;
using Microsoft.Extensions.Configuration;
using DMSpro.OMS.AdministrationService.Permissions;
using DMSpro.OMS.Localization;
using DMSpro.OMS.ProductService.Web.Menus;
using Volo.Abp.Account.Localization;
using Volo.Abp.AuditLogging.Web.Navigation;
using Volo.Abp.Identity.Web.Navigation;
using Volo.Abp.LanguageManagement.Navigation;
using Volo.Abp.SettingManagement.Web.Navigation;
using Volo.Abp.TextTemplateManagement.Web.Navigation;
using Volo.Abp.UI.Navigation;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.OpenIddict.Pro.Web.Menus;
using Volo.Saas.Host.Navigation;
using DMSpro.OMS.MdmService.Permissions;
using DMSpro.OMS.MdmService.Web.Menus;
using DMSpro.OMS.Localization;
using DMSpro.OMS.MdmService;
using Volo.Abp.Features;
using System.Collections.Generic;
using DMSpro.OMS.InventoryService.Permissions;
using Volo.Forms.Localization;
using Volo.Forms.Web.Menus;
using DMSpro.OMS.OrderService.Localization;
using DMSpro.OMS.OrderService.Web.Menus;
using DMSpro.OMS.OrderService.Permissions;
using Volo.Saas.Localization;
using Volo.Saas.Host;
using DMSpro.OMS.InventoryService.Web.Menus;
using DMSpro.OMS.InventoryService;

namespace DMSpro.OMS.Web.Navigation;

public class OMSMenuContributor : IMenuContributor
{
    private readonly IConfiguration _configuration;

    public OMSMenuContributor(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task ConfigureMenuAsync(MenuConfigurationContext context)
    {
        if (context.Menu.Name == StandardMenus.Main)
        {
            await ConfigureMainMenuAsync(context);
        }
        else if (context.Menu.Name == StandardMenus.User)
        {
            await ConfigureUserMenuAsync(context);
        }
    }

    private static async Task ConfigureMainMenuAsync(MenuConfigurationContext context)
    {
        var l = context.GetLocalizer<OMSResource>();

        //Home
        context.Menu.AddItem(
            new ApplicationMenuItem(
                OMSMenus.Home,
                l["Menu:Home"],
                "~/",
                icon: "fal fa-home",
                order: 0
            )
        );

        //Host Dashboard
        context.Menu.AddItem(
            new ApplicationMenuItem(
                OMSMenus.HostDashboard,
                l["Menu:Dashboard"],
                "~/HostDashboard",
                icon: "fal fa-chart-area",
                order: 1
            ).RequirePermissions(AdministrationServicePermissions.Dashboard.Host)
        );

        //Tenant Dashboard
        context.Menu.AddItem(
            new ApplicationMenuItem(
                OMSMenus.TenantDashboard,
                l["Menu:Dashboard"],
                "~/Dashboard",
                icon: "fal fa-chart-area",
                order: 1
            ).RequirePermissions(AdministrationServicePermissions.Dashboard.Tenant)
        );

        context.Menu.SetSubItemOrder(ProductServiceMenus.ProductManagement, 2);

        context.Menu.SetSubItemOrder(SaasHostMenuNames.GroupName, 3);

		//saas
		//AddModuleSaaSMenuItem(context);
        //Administration
        var administration = context.Menu.GetAdministration();
        administration.Order = 4;

        //Administration->Identity
        administration.SetSubItemOrder(IdentityMenuNames.GroupName, 1);

        //Administration->OpenIddict
        administration.SetSubItemOrder(OpenIddictProMenus.GroupName, 2);

        //Administration->Language Management
        administration.SetSubItemOrder(LanguageManagementMenuNames.GroupName, 3);

        //Administration->Text Templates
        administration.SetSubItemOrder(TextTemplateManagementMainMenuNames.GroupName, 4);

        //Administration->Audit Logs
        administration.SetSubItemOrder(AbpAuditLoggingMainMenuNames.GroupName, 5);

        //Administration->Settings
        administration.SetSubItemOrder(SettingManagementMenuNames.GroupName, 6);

		//mdm
		var mdmMenu = AddModuleMdmMenuItem(context);
        AddMenuItemSystem(context, mdmMenu);
		AddMenuItemGeographical(context, mdmMenu);
		AddMenuItemCompanies(context, mdmMenu);
		AddMenuProductItems(context, mdmMenu);
		AddMenuItemSalesOrganizations(context, mdmMenu);
		AddMenuItemCustomers(context, mdmMenu);
		AddMenuItemRouteAndMCP(context, mdmMenu);

		//inventory
		AddModuleInventoryMenuItem(context);
		//po
		var poMenu = AddModulePOMenuItem(context);
		AddMenuItemPurchaseRequestHeaders(context, poMenu);
		AddMenuItemPurchaseOrderHeaders(context, poMenu);
		AddMenuItemPurchaseReceiptHeaders(context, poMenu); 
		AddMenuItemGoodsReturnRequestHeaders(context, poMenu);
		AddMenuItemGoodsReturnHeaders(context, poMenu);

		//so
		var soMenu = AddModuleSOMenuItem(context);
		AddMenuItemSalesRequestHeaders(context, soMenu);
		AddMenuItemSalesOrderHeaders(context, soMenu);
		AddMenuItemDeliveryHeaders(context, soMenu);
        AddMenuItemArInvoiceHeaders(context, soMenu); 
        AddMenuItemReturnOrderHeaders(context, soMenu);
        AddMenuItemArCreditMemoHeaders(context, soMenu);
        AddMenuItemProcessSalesOrderHeaders(context, soMenu);
        //AddMenuItemProcessDeliveryHeaders(context, soMenu);
        //AddMenuItemProcessSOToInvoice(context, soMenu);

		//maps
        var mapsMenu = AddModuleMapsMenuItem(context);
    }
    private static ApplicationMenuItem AddModuleMapsMenuItem(MenuConfigurationContext context)
    {
        var moduleMenu = new ApplicationMenuItem(
            MdmServiceMenus.Maps,
            context.GetLocalizer<OMSResource>()["Menu:MdmService:Maps"],
            "/Mdm/Maps",
            icon: "fas fa-map-marked",
            requiredPermissionName: MdmServicePermissions.GeoMasters.Default
        ).RequireFeatures(MdmFeatures.GeoMaster);

        context.Menu.Items.AddIfNotContains(moduleMenu);
        return moduleMenu;
    }
    private static ApplicationMenuItem AddModulePOMenuItem(MenuConfigurationContext context)
    {
        var moduleMenu = new ApplicationMenuItem(
            OrderServiceMenus.Prefix,
            context.GetLocalizer<OMSResource>()["Menu:POService:GroupMenu:PO"],
            icon: "fa fa-sort"
        );

        context.Menu.Items.AddIfNotContains(moduleMenu);
        return moduleMenu;
    }

    private static ApplicationMenuItem AddModuleSOMenuItem(MenuConfigurationContext context)
    {
        var moduleMenu = new ApplicationMenuItem(
            OrderServiceMenus.Prefix,
            context.GetLocalizer<OMSResource>()["Menu:SOService:GroupMenu:SO"],
            icon: "fal fa-tag"
        );

        context.Menu.Items.AddIfNotContains(moduleMenu);
        return moduleMenu;
    }
    private static void AddMenuItemSalesOrderHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.SalesOrderHeaders,
                context.GetLocalizer<OMSResource>()["Menu:SOService:SalesOrder"],
                "/SO/SalesOrders",
                icon: "fa fa-bars",
                requiredPermissionName: OrderServicePermissions.SalesOrders.Edit
            )
        );
    }
    private static void AddMenuItemProcessSalesOrderHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.SalesOrderHeaders,
                context.GetLocalizer<OMSResource>()["Menu:SOService:ProcessSalesOrder"],
                "/SO/ProcessSalesOrder",
                icon: "fa fa-list-ol",
                requiredPermissionName: OrderServicePermissions.SalesOrders.Default
            )
        );
    }

    //private static void AddMenuItemSalesOrderDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    //{
    //    parentMenu.AddItem(
    //        new ApplicationMenuItem(
    //            OrderServiceMenus.SalesOrderDetails,
    //            context.GetLocalizer<OrderServiceResource>()["Menu:SalesOrderDetails"],
    //            "/SalesOrderDetails",
    //            icon: "fa fa-file-alt",
    //            requiredPermissionName: OrderServicePermissions.SalesOrderDetails.Default
    //        )
    //    );
    //}

    private static void AddMenuItemPurchaseRequestHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.PurchaseRequestHeaders,
                context.GetLocalizer<OMSResource>()["Menu:POService:PurchaseRequest"],
                "/POs/PurchaseRequests",
                icon: "fa fa-th-list",
                requiredPermissionName: OrderServicePermissions.PurchaseRequests.Default
            )
        );
    }

    //private static void AddMenuItemPurchaseRequestDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    //{
    //    parentMenu.AddItem(
    //        new ApplicationMenuItem(
    //            OrderServiceMenus.PurchaseRequestDetails,
    //            context.GetLocalizer<OrderServiceResource>()["Menu:PurchaseRequestDetails"],
    //            "/POs/PurchaseRequestDetails",
    //            icon: "fa fa-th-list",
    //            requiredPermissionName: OrderServicePermissions.PurchaseRequestDetails.Default
    //        )
    //    );
    //}

    private static void AddMenuItemPurchaseOrderHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.PurchaseOrderHeaders,
                context.GetLocalizer<OMSResource>()["Menu:POService:PurchaseOrder"],
                "/Pos/PurchaseOrders",
                icon: "fa fa-list-alt",
                requiredPermissionName: OrderServicePermissions.PurchaseOrders.Default
            )
        );
    }

    private static void AddMenuItemPurchaseOrderDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
		//same permission
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.PurchaseOrderDetails,
                context.GetLocalizer<OrderServiceResource>()["Menu:PurchaseOrderDetails"],
                "/PurchaseOrderDetails",
                icon: "fa fa-file-alt",
                requiredPermissionName: OrderServicePermissions.PurchaseOrders.Default
            )
        );
    }

    private static void AddMenuItemPurchaseReceiptHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.PurchaseReceiptHeaders,
                context.GetLocalizer<OMSResource>()["Menu:POService:PurchaseReceipt"],
                "/POs/PurchaseReceipts",
                icon: "fa fa-file-text-o",
                requiredPermissionName: OrderServicePermissions.PurchaseReceipts.Default
            )
        );
    }
	//removed
    //private static void AddMenuItemPurchaseReceiptDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    //{
    //    parentMenu.AddItem(
    //        new ApplicationMenuItem(
    //            OrderServiceMenus.PurchaseReceiptDetails,
    //             context.GetLocalizer<OMSResource>()["Menu:POService:PurchaseReceiptConfirmation"],
    //            "/POs/PurchaseReceiptConfirmations",
    //            icon: "fa fa-check-square-o",
    //            requiredPermissionName: OrderServicePermissions.PurchaseReceiptConfirmations.Default
    //        )
    //    );
    //}

    private static void AddMenuItemGoodsReturnRequestHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.GoodsReturnRequestHeaders,
                  context.GetLocalizer<OMSResource>()["Menu:POService:GoodsReturnRequest"],
                "/POs/GoodsReturnRequests",
                icon: "fa fa-bars",
                requiredPermissionName: OrderServicePermissions.GoodsReturnRequests.Default
            )
        );
    }

    //private static void AddMenuItemGoodsReturnRequestDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    //{
    //    parentMenu.AddItem(
    //        new ApplicationMenuItem(
    //            OrderServiceMenus.GoodsReturnRequestDetails,
    //            context.GetLocalizer<OrderServiceResource>()["Menu:GoodsReturnRequestDetails"],
    //            "/GoodsReturnRequestDetails",
    //            icon: "fa fa-file-alt",
    //            requiredPermissionName: OrderServicePermissions.GoodsReturnRequestDetails.Default
    //        )
    //    );
    //}

    private static void AddMenuItemGoodsReturnHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.GoodsReturnHeaders,
               context.GetLocalizer<OMSResource>()["Menu:POService:GoodsReturn"],
                "/POs/GoodsReturns",
                icon: "fa fa-arrows-h",
                requiredPermissionName: OrderServicePermissions.GoodsReturns.Default
            )
        );
    }

    //private static void AddMenuItemGoodsReturnDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    //{
    //    parentMenu.AddItem(
    //        new ApplicationMenuItem(
    //            OrderServiceMenus.GoodsReturnDetails,
    //            context.GetLocalizer<OrderServiceResource>()["Menu:GoodsReturnDetails"],
    //            "/GoodsReturnDetails",
    //            icon: "fa fa-file-alt",
    //            requiredPermissionName: OrderServicePermissions.GoodsReturnDetails.Default
    //        )
    //    );
    //}

    private static void AddMenuItemSalesRequestHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.SalesRequestHeaders,
                context.GetLocalizer<OMSResource>()["Menu:SOService:SalesRequest"],
                "/SO/SalesRequest",
                icon: "fa fa-list-ul",
                requiredPermissionName: OrderServicePermissions.SalesRequests.Default
            )
        );
    }

	//private static void AddMenuItemSalesRequestDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
	//{
	//	parentMenu.AddItem(
	//		new ApplicationMenuItem(
	//			OrderServiceMenus.SalesRequestDetails,
	//			context.GetLocalizer<OrderServiceResource>()["Menu:SalesRequestDetails"],
	//			"/SalesRequestDetails",
	//			icon: "fa fa-file-alt",
	//			requiredPermissionName: OrderServicePermissions.SalesRequestDetails.Default
	//		)
	//	);
	//}

	private static void AddMenuItemDeliveryHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.DeliveryHeaders,
                context.GetLocalizer<OMSResource>()["Menu:SOService:Delivery"],
                "/SO/Delivery",
                icon: "fa fa-truck",
                requiredPermissionName: OrderServicePermissions.Deliveries.Edit
            )
        );
    }
    //private static void AddMenuItemProcessDeliveryHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    //{
    //    parentMenu.AddItem(
    //        new ApplicationMenuItem(
    //            OrderServiceMenus.DeliveryHeaders,
    //            context.GetLocalizer<OMSResource>()["Menu:SOService:ProcessDelivery"],
    //            "/SO/ProcessDelivery",
    //            icon: "fa fa-archive",
    //            requiredPermissionName: OrderServicePermissions.Deliveries.Default
    //        )
    //    );
    //}
    //private static void AddMenuItemProcessSOToInvoice(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    //{
    //    parentMenu.AddItem(
    //        new ApplicationMenuItem(
    //            OrderServiceMenus.DeliveryHeaders,
    //            context.GetLocalizer<OMSResource>()["Menu:SOService:ProcessSOToInvoice"],
    //            "/SO/ProcessSOToInvoice",
    //            icon: "fa fa-archive",
    //            requiredPermissionName: OrderServicePermissions.Deliveries.Default
    //        )
    //    );
    //}
    //private static void AddMenuItemDeliveryDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    //{
    //    parentMenu.AddItem(
    //        new ApplicationMenuItem(
    //            OrderServiceMenus.DeliveryDetails,
    //            context.GetLocalizer<OrderServiceResource>()["Menu:DeliveryDetails"],
    //            "/DeliveryDetails",
    //            icon: "fa fa-file-alt",
    //            requiredPermissionName: OrderServicePermissions.DeliveryDetails.Default
    //        )
    //    );
    //}

    private static void AddMenuItemArInvoiceHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
	{
		parentMenu.AddItem(
			new ApplicationMenuItem(
				OrderServiceMenus.ArHeaders,
				context.GetLocalizer<OMSResource>()["Menu:SOService:ArInvoice"],
                "/SO/ARInvoice",
				icon: "fa fa-check-circle-o",
				requiredPermissionName: OrderServicePermissions.ArInvoices.Default
			)
		);
	}

	//private static void AddMenuItemArDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
	//{
	//	parentMenu.AddItem(
	//		new ApplicationMenuItem(
	//			OrderServiceMenus.ArDetails,
	//			context.GetLocalizer<OrderServiceResource>()["Menu:ArDetails"],
	//			"/ArDetails",
	//			icon: "fa fa-file-alt",
	//			requiredPermissionName: OrderServicePermissions.ArDetails.Default
	//		)
	//	);
	//} 
	private static void AddMenuItemReturnOrderHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.ReturnOrderHeaders,
                context.GetLocalizer<OMSResource>()["Menu:SOService:ReturnOrder"],
                "/SO/ReturnOrder",
                icon: "fa fa-arrows-v",
                requiredPermissionName: OrderServicePermissions.ReturnOrders.Default
            )
        );
    }

    //private static void AddMenuItemReturnOrderDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    //{
    //    parentMenu.AddItem(
    //        new ApplicationMenuItem(
    //            OrderServiceMenus.ReturnOrderDetails,
    //            context.GetLocalizer<OrderServiceResource>()["Menu:ReturnOrderDetails"],
    //            "/ReturnOrderDetails",
    //            icon: "fa fa-file-alt",
    //            requiredPermissionName: OrderServicePermissions.ReturnOrderDetails.Default
    //        )
    //    );
    //}

    private static void AddMenuItemArCreditMemoHeaders(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    {
        parentMenu.AddItem(
            new ApplicationMenuItem(
                OrderServiceMenus.ArCreditMemoHeaders,
                context.GetLocalizer<OMSResource>()["Menu:SOService:ArCreditMemo"],
                "/SO/ARCreditMemo",
                icon: "fa fa-credit-card",
                requiredPermissionName: OrderServicePermissions.ArCreditMemos.Default
            )
        );
    }

    //private static void AddMenuItemArCreditMemoDetails(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
    //{
    //    parentMenu.AddItem(
    //        new ApplicationMenuItem(
    //            OrderServiceMenus.ArCreditMemoDetails,
    //            context.GetLocalizer<OrderServiceResource>()["Menu:ArCreditMemoDetails"],
    //            "/ArCreditMemoDetails",
    //            icon: "fa fa-file-alt",
    //            requiredPermissionName: OrderServicePermissions.ArCreditMemoDetails.Default
    //        )
    //    );
    //}
    
    private static void AddModuleSurveyMenuItem(MenuConfigurationContext context)
	{
        var formMenuItem = new ApplicationMenuItem(FormsMenus.GroupName, 
			context.GetLocalizer<FormsResource>()["Menu:Survey"], icon: "fa fa-tachometer", url: "/Forms");
        context.Menu.AddItem(formMenuItem);
    }
	private static void AddModuleInventoryMenuItem(MenuConfigurationContext context)
	{
		var moduleMenu = new ApplicationMenuItem(
			InventoryServicePermissions.GroupName,
			context.GetLocalizer<OMSResource>()["Menu:InventoryService:GroupMenu:Inventory"],
			icon: "fa fa-bookmark"
		).RequireFeatures(InventoryFeatures.Enable);

		context.Menu.Items.AddIfNotContains(moduleMenu);

        moduleMenu.AddItem(new ApplicationMenuItem(
                InventoryServiceMenus.Prefix,
                context.GetLocalizer<OMSResource>()["Menu:InventoryService:Warehouses"],
                "/Inventories/Warehouses",
                icon: "fa fa-list-ul",
				requiredPermissionName: InventoryServicePermissions.Warehouses.Default
            ));

        moduleMenu.AddItem(new ApplicationMenuItem(
               InventoryServiceMenus.Prefix,
               context.GetLocalizer<OMSResource>()["Menu:InventoryService:Inventories"],
               "/Inventories/Inventories",
               icon: "fa fa-file-alt",
               requiredPermissionName: InventoryServicePermissions.Inventories.Default
           ));
        moduleMenu.AddItem(new ApplicationMenuItem(
               InventoryServiceMenus.Prefix,
               context.GetLocalizer<OMSResource>()["Menu:InventoryService:GoodsReceipt"],
               "/Inventories/GoodsReceipt",
               icon: "fa fa-thumbs-up",
              requiredPermissionName: InventoryServicePermissions.INReceipts.Default
           ));
        moduleMenu.AddItem(new ApplicationMenuItem(
               InventoryServiceMenus.Prefix,
               context.GetLocalizer<OMSResource>()["Menu:InventoryService:GoodsIssue"],
               "/Inventories/GoodsIssue",
               icon: "fa fa-thumbs-o-up",
               requiredPermissionName: InventoryServicePermissions.INIssues.Default
           ));
        moduleMenu.AddItem(new ApplicationMenuItem(
               InventoryServiceMenus.Prefix,
               context.GetLocalizer<OMSResource>()["Menu:InventoryService:InventoryTransfers"],
               "/Inventories/InventoryTransfers",
               icon: "fa fa-truck",
               requiredPermissionName: InventoryServicePermissions.INTransfers.Default
           ));
        moduleMenu.AddItem(new ApplicationMenuItem(
               InventoryServiceMenus.Prefix,
               context.GetLocalizer<OMSResource>()["Menu:InventoryService:InventoryCounting"],
               "/Inventories/InventoryCounting",
               icon: "fa fa-list-ol",
               requiredPermissionName: InventoryServicePermissions.INItemTrackings.Default
           ));
        // moduleMenu.AddItem(new ApplicationMenuItem(
        //        InventoryServiceMenus.Prefix,
        //        context.GetLocalizer<OMSResource>()["Menu:InventoryService:InventoryAdjustment"],
        //        "/Inventories/InventoryAdjustment",
        //        icon: "fa fa-adjust"
        //    //requiredPermissionName: InventoryServicePermissions.InventoryAdjustment.Default
        //    ));
        //var myGroup = context.AddGroup(InventoryServicePermissions.GroupName, L("Permission:InventoryService"));
        //context.Menu.AddItem(InventoryServicePermissions.GroupName, L("Permission:InventoryService"));
        //Define your own permissions here. Example:
        //myGroup.AddPermission(BookStorePermissions.MyPermission1, L("Permission:MyPermission1"));

        //var iNReceiptPermission = myGroup.AddPermission(InventoryServicePermissions.INReceipts.Default, L("Permission:INReceipts"));
        //iNReceiptPermission.AddChild(InventoryServicePermissions.INReceipts.Create, L("Permission:Create"));
        //iNReceiptPermission.AddChild(InventoryServicePermissions.INReceipts.Edit, L("Permission:Edit"));
        //iNReceiptPermission.AddChild(InventoryServicePermissions.INReceipts.Delete, L("Permission:Delete"));
        //iNReceiptPermission.AddChild(InventoryServicePermissions.INReceipts.Confirm, L("Permission:Confirm"));
        //iNReceiptPermission.AddChild(InventoryServicePermissions.INReceipts.Cancel, L("Permission:Cancel"));

        //var iNReceiptDetailPermission = myGroup.AddPermission(InventoryServicePermissions.INReceiptDetails.Default, L("Permission:INReceiptDetails"));
        //iNReceiptDetailPermission.AddChild(InventoryServicePermissions.INReceiptDetails.Create, L("Permission:Create"));
        //iNReceiptDetailPermission.AddChild(InventoryServicePermissions.INReceiptDetails.Edit, L("Permission:Edit"));
        //iNReceiptDetailPermission.AddChild(InventoryServicePermissions.INReceiptDetails.Delete, L("Permission:Delete"));

        //var iNReceiptDetailSplitPermission =
        //	myGroup.AddPermission(InventoryServicePermissions.INReceiptDetailSplits.Default, L("Permission:INReceiptDetailSplits"));
        //iNReceiptDetailSplitPermission.AddChild(InventoryServicePermissions.INReceiptDetailSplits.Create, L("Permission:Create"));
        //iNReceiptDetailSplitPermission.AddChild(InventoryServicePermissions.INReceiptDetailSplits.Edit, L("Permission:Edit"));
        //iNReceiptDetailSplitPermission.AddChild(InventoryServicePermissions.INReceiptDetailSplits.Delete, L("Permission:Delete"));

        //var iNReceiptEmeiListPermission =
        //	myGroup.AddPermission(InventoryServicePermissions.INReceiptEmeiLists.Default, L("Permission:INReceiptEmeiLists"));
        //iNReceiptEmeiListPermission.AddChild(InventoryServicePermissions.INReceiptEmeiLists.Create, L("Permission:Create"));
        //iNReceiptEmeiListPermission.AddChild(InventoryServicePermissions.INReceiptEmeiLists.Edit, L("Permission:Edit"));
        //iNReceiptEmeiListPermission.AddChild(InventoryServicePermissions.INReceiptEmeiLists.Delete, L("Permission:Delete"));

        //var iNIssuePermission = myGroup.AddPermission(InventoryServicePermissions.INIssues.Default, L("Permission:INIssues"));
        //iNIssuePermission.AddChild(InventoryServicePermissions.INIssues.Create, L("Permission:Create"));
        //iNIssuePermission.AddChild(InventoryServicePermissions.INIssues.Edit, L("Permission:Edit"));
        //iNIssuePermission.AddChild(InventoryServicePermissions.INIssues.Delete, L("Permission:Delete"));
        //iNIssuePermission.AddChild(InventoryServicePermissions.INIssues.Confirm, L("Permission:Confirm"));
        //iNIssuePermission.AddChild(InventoryServicePermissions.INIssues.Cancel, L("Permission:Cancel"));

        //var iNIssueDetailPermission = myGroup.AddPermission(InventoryServicePermissions.INIssueDetails.Default, L("Permission:INIssueDetails"));
        //iNIssueDetailPermission.AddChild(InventoryServicePermissions.INIssueDetails.Create, L("Permission:Create"));
        //iNIssueDetailPermission.AddChild(InventoryServicePermissions.INIssueDetails.Edit, L("Permission:Edit"));
        //iNIssueDetailPermission.AddChild(InventoryServicePermissions.INIssueDetails.Delete, L("Permission:Delete"));

        //var iNIssueDetailSplitPermission =
        //	myGroup.AddPermission(InventoryServicePermissions.INIssueDetailSplits.Default, L("Permission:INIssueDetailSplits"));
        //iNIssueDetailSplitPermission.AddChild(InventoryServicePermissions.INIssueDetailSplits.Create, L("Permission:Create"));
        //iNIssueDetailSplitPermission.AddChild(InventoryServicePermissions.INIssueDetailSplits.Edit, L("Permission:Edit"));
        //iNIssueDetailSplitPermission.AddChild(InventoryServicePermissions.INIssueDetailSplits.Delete, L("Permission:Delete"));

        //var iNIssueDetailImeiPermission =
        //	myGroup.AddPermission(InventoryServicePermissions.INIssueDetailImeis.Default, L("Permission:INIssueDetailImeis"));
        //iNIssueDetailImeiPermission.AddChild(InventoryServicePermissions.INIssueDetailImeis.Create, L("Permission:Create"));
        //iNIssueDetailImeiPermission.AddChild(InventoryServicePermissions.INIssueDetailImeis.Edit, L("Permission:Edit"));
        //iNIssueDetailImeiPermission.AddChild(InventoryServicePermissions.INIssueDetailImeis.Delete, L("Permission:Delete"));

        //var iNIssueDetailEmeiPermission =
        //	myGroup.AddPermission(InventoryServicePermissions.INIssueDetailEmeis.Default, L("Permission:INIssueDetailEmeis"));
        //iNIssueDetailEmeiPermission.AddChild(InventoryServicePermissions.INIssueDetailEmeis.Create, L("Permission:Create"));
        //iNIssueDetailEmeiPermission.AddChild(InventoryServicePermissions.INIssueDetailEmeis.Edit, L("Permission:Edit"));
        //iNIssueDetailEmeiPermission.AddChild(InventoryServicePermissions.INIssueDetailEmeis.Delete, L("Permission:Delete"));

        //var iNReceiptDetailSerialPermission =
        //	myGroup.AddPermission(InventoryServicePermissions.INReceiptDetailSerials.Default, L("Permission:INReceiptDetailSerials"));
        //iNReceiptDetailSerialPermission.AddChild(InventoryServicePermissions.INReceiptDetailSerials.Create, L("Permission:Create"));
        //iNReceiptDetailSerialPermission.AddChild(InventoryServicePermissions.INReceiptDetailSerials.Edit, L("Permission:Edit"));
        //iNReceiptDetailSerialPermission.AddChild(InventoryServicePermissions.INReceiptDetailSerials.Delete, L("Permission:Delete"));

        //var iNIssueDetailSerialPermission =
        //	myGroup.AddPermission(InventoryServicePermissions.INIssueDetailSerials.Default, L("Permission:INIssueDetailSerials"));
        //iNIssueDetailSerialPermission.AddChild(InventoryServicePermissions.INIssueDetailSerials.Create, L("Permission:Create"));
        //iNIssueDetailSerialPermission.AddChild(InventoryServicePermissions.INIssueDetailSerials.Edit, L("Permission:Edit"));
        //iNIssueDetailSerialPermission.AddChild(InventoryServicePermissions.INIssueDetailSerials.Delete, L("Permission:Delete"));

        //var warehousePermission = myGroup.AddPermission(InventoryServicePermissions.Warehouses.Default, L("Permission:Warehouses"));
        ////warehousePermission.AddChild(InventoryServicePermissions.Warehouses.Create, L("Permission:Create"));
        ////warehousePermission.AddChild(InventoryServicePermissions.Warehouses.Edit, L("Permission:Edit"));
        ////warehousePermission.AddChild(InventoryServicePermissions.Warehouses.Delete, L("Permission:Delete"));

        //var wHLocationPermission = myGroup.AddPermission(InventoryServicePermissions.WHLocations.Default, L("Permission:WHLocations"));
        //wHLocationPermission.AddChild(InventoryServicePermissions.WHLocations.Create, L("Permission:Create"));
        //wHLocationPermission.AddChild(InventoryServicePermissions.WHLocations.Edit, L("Permission:Edit"));
        //wHLocationPermission.AddChild(InventoryServicePermissions.WHLocations.Delete, L("Permission:Delete"));

        //var wHImagePermission = myGroup.AddPermission(InventoryServicePermissions.WHImages.Default, L("Permission:WHImages"));
        //wHImagePermission.AddChild(InventoryServicePermissions.WHImages.Create, L("Permission:Create"));
        //wHImagePermission.AddChild(InventoryServicePermissions.WHImages.Edit, L("Permission:Edit"));
        //wHImagePermission.AddChild(InventoryServicePermissions.WHImages.Delete, L("Permission:Delete"));

        //var inventoryPermission = myGroup.AddPermission(InventoryServicePermissions.Inventories.Default, L("Permission:Inventories"));
        //inventoryPermission.AddChild(InventoryServicePermissions.Inventories.Create, L("Permission:Create"));
        //inventoryPermission.AddChild(InventoryServicePermissions.Inventories.Edit, L("Permission:Edit"));
        //inventoryPermission.AddChild(InventoryServicePermissions.Inventories.Delete, L("Permission:Delete"));

        //var invtBatchPermission = myGroup.AddPermission(InventoryServicePermissions.InvtBatches.Default, L("Permission:InvtBatches"));
        //invtBatchPermission.AddChild(InventoryServicePermissions.InvtBatches.Create, L("Permission:Create"));
        //invtBatchPermission.AddChild(InventoryServicePermissions.InvtBatches.Edit, L("Permission:Edit"));
        //invtBatchPermission.AddChild(InventoryServicePermissions.InvtBatches.Delete, L("Permission:Delete"));

        //var invtSerialPermission = myGroup.AddPermission(InventoryServicePermissions.InvtSerials.Default, L("Permission:InvtSerials"));
        //invtSerialPermission.AddChild(InventoryServicePermissions.InvtSerials.Create, L("Permission:Create"));
        //invtSerialPermission.AddChild(InventoryServicePermissions.InvtSerials.Edit, L("Permission:Edit"));
        //invtSerialPermission.AddChild(InventoryServicePermissions.InvtSerials.Delete, L("Permission:Delete"));

        //var iNItemTrackingPermission = myGroup.AddPermission(InventoryServicePermissions.INItemTrackings.Default, L("Permission:INItemTrackings"));
        //iNItemTrackingPermission.AddChild(InventoryServicePermissions.INItemTrackings.Create, L("Permission:Create"));
        //iNItemTrackingPermission.AddChild(InventoryServicePermissions.INItemTrackings.Edit, L("Permission:Edit"));
        //iNItemTrackingPermission.AddChild(InventoryServicePermissions.INItemTrackings.Delete, L("Permission:Delete"));

        //var iNItemTrackingDetailPermission = myGroup.AddPermission(InventoryServicePermissions.INItemTrackingDetails.Default, L("Permission:INItemTrackingDetails"));
        //iNItemTrackingDetailPermission.AddChild(InventoryServicePermissions.INItemTrackingDetails.Create, L("Permission:Create"));
        //iNItemTrackingDetailPermission.AddChild(InventoryServicePermissions.INItemTrackingDetails.Edit, L("Permission:Edit"));
        //iNItemTrackingDetailPermission.AddChild(InventoryServicePermissions.INItemTrackingDetails.Delete, L("Permission:Delete"));

        //var iNTransferPermission = myGroup.AddPermission(InventoryServicePermissions.INTransfers.Default, L("Permission:INTransfers"));
        //iNTransferPermission.AddChild(InventoryServicePermissions.INTransfers.Create, L("Permission:Create"));
        //iNTransferPermission.AddChild(InventoryServicePermissions.INTransfers.Edit, L("Permission:Edit"));
        //iNTransferPermission.AddChild(InventoryServicePermissions.INTransfers.Delete, L("Permission:Delete"));

        //var iNTransferDetailPermission = myGroup.AddPermission(InventoryServicePermissions.INTransferDetails.Default, L("Permission:INTransferDetails"));
        //iNTransferDetailPermission.AddChild(InventoryServicePermissions.INTransferDetails.Create, L("Permission:Create"));
        //iNTransferDetailPermission.AddChild(InventoryServicePermissions.INTransferDetails.Edit, L("Permission:Edit"));
        //iNTransferDetailPermission.AddChild(InventoryServicePermissions.INTransferDetails.Delete, L("Permission:Delete"));

        //var iNTransferSerialPermission = myGroup.AddPermission(InventoryServicePermissions.INTransferSerials.Default, L("Permission:INTransferSerials"));
        //iNTransferSerialPermission.AddChild(InventoryServicePermissions.INTransferSerials.Create, L("Permission:Create"));
        //iNTransferSerialPermission.AddChild(InventoryServicePermissions.INTransferSerials.Edit, L("Permission:Edit"));
        //iNTransferSerialPermission.AddChild(InventoryServicePermissions.INTransferSerials.Delete, L("Permission:Delete"));

        //var iNTransferSplitPermission = myGroup.AddPermission(InventoryServicePermissions.INTransferSplits.Default, L("Permission:INTransferSplits"));
        //iNTransferSplitPermission.AddChild(InventoryServicePermissions.INTransferSplits.Create, L("Permission:Create"));
        //iNTransferSplitPermission.AddChild(InventoryServicePermissions.INTransferSplits.Edit, L("Permission:Edit"));
        //iNTransferSplitPermission.AddChild(InventoryServicePermissions.INTransferSplits.Delete, L("Permission:Delete"));
    }
	private static void AddModuleSaaSMenuItem(MenuConfigurationContext context)
	{
        var l = context.GetLocalizer<SaasResource>();

        var saasMenu = new ApplicationMenuItem(SaasHostMenuNames.GroupName, l["Menu:Saas"], icon: "fal fa-globe");
        context.Menu.AddItem(saasMenu);

        saasMenu.AddItem(new ApplicationMenuItem(
            SaasHostMenuNames.Tenants,
            l["Tenants"],
            url: "~/Saas/Host/Tenants",
            icon: "fa fa-users"
            ).RequirePermissions(SaasHostPermissions.Tenants.Default));

        saasMenu.AddItem(new ApplicationMenuItem(
            SaasHostMenuNames.Editions,
            l["Editions"],
            url: "~/Saas/Host/Editions",
            icon: "fa fa-th"
            ).RequirePermissions(SaasHostPermissions.Tenants.Default));  
    }
    private static ApplicationMenuItem AddModuleMdmMenuItem(MenuConfigurationContext context)
	{
		//InventoryServiceMenus.Prefix;
		//OMSResource
		//InventoryFeatures.Enable;

        var moduleMenu = new ApplicationMenuItem(
			MdmServiceMenus.Prefix,
			context.GetLocalizer<OMSResource>()["Menu:MdmService:GroupMenu:Mdm"],
			icon: "fal fal fa-window"
		).RequireFeatures(MdmFeatures.Enable);

		context.Menu.Items.AddIfNotContains(moduleMenu);
		return moduleMenu;
	}

	private static void AddMenuItemSystem(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
	{
		ApplicationMenuItem groupMenu = new ApplicationMenuItem(
			   MdmServiceMenus.Administration,
			   context.GetLocalizer<OMSResource>()["Menu:MdmService:GroupMenu:Administration"],
			   null,
			   icon: "fa fa-cogs"
		   )
			.RequirePermissions(false, MdmServicePermissions.SystemData.Default,
				MdmServicePermissions.SystemConfig.Default, MdmServicePermissions.NumberingConfigs.Default)
			.RequireFeatures(false, MdmFeatures.SystemData, MdmFeatures.SystemConfig, MdmFeatures.NumberingConfig);

		parentMenu.AddItem(groupMenu);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.SystemData,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:SystemData"],
				"/Mdm/SystemDatas",
				icon: "fa fa-database",
				requiredPermissionName: MdmServicePermissions.SystemData.Default
			).RequireFeatures(MdmFeatures.SystemData)
		);

		//removed
		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.SystemConfig,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:SystemConfigs"],
		//		"/SystemConfigs",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.SystemConfig.Default
		//	).RequireFeatures(MdmFeatures.SystemConfig)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.NumberingConfig,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:NumberingConfigs"],
				"/Mdm/NumberingConfigs",
				icon: "fa fa-file-code-o",
				requiredPermissionName: MdmServicePermissions.NumberingConfigs.Default
			).RequireFeatures(MdmFeatures.NumberingConfig)
		);
	}

	private static void AddMenuItemGeographical(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
	{
		ApplicationMenuItem groupMenu = new ApplicationMenuItem(
			   MdmServiceMenus.Geographical,
			   context.GetLocalizer<OMSResource>()["Menu:MdmService:GroupMenu:Geographical"],
			   null,
			   icon: "fa fa-map-pin"
           )
			.RequirePermissions(false, MdmServicePermissions.GeoMasters.Default)
			.RequireFeatures(false, MdmFeatures.GeoMaster);

		parentMenu.AddItem(groupMenu);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.GeoMasters,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:GeoMasters"],
				"/Mdm/GeoMasters",
				icon: "fa fa-map",
				requiredPermissionName: MdmServicePermissions.GeoMasters.Default
			).RequireFeatures(MdmFeatures.GeoMaster)
		);
		//map
		//set tạm thời. vì chưa có permission cho map
		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.Maps,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:Maps"],
		//		"/Mdm/Maps",
		//		icon: "fas fa-map-marked",
  //              requiredPermissionName: MdmServicePermissions.GeoMasters.Default
  //          ).RequireFeatures(MdmFeatures.GeoMaster)
  //      );
	}

	private static void AddMenuItemCompanies(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
	{
		ApplicationMenuItem groupMenu = new ApplicationMenuItem(
			   MdmServiceMenus.Companies,
			   context.GetLocalizer<OMSResource>()["Menu:MdmService:Company"],
			   null,
			   icon: "fa fa-building"
		   )
			.RequirePermissions(false, MdmServicePermissions.CompanyMasters.Default,
				MdmServicePermissions.VATs.Default,
				MdmServicePermissions.SalesChannels.Default,
				MdmServicePermissions.CompanyIdentityUserAssignments.Default)
			.RequireFeatures(false,
				MdmFeatures.CompanyMaster,
				MdmFeatures.VATs,
				MdmFeatures.SalesChannels,
				MdmFeatures.CompanyIdentityUserAssignments);

		parentMenu.AddItem(groupMenu);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.CompanyMaster,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:CompanyProfiles"],
				"/Mdm/Companies",
				icon: "fa fa-id-card-o",
				requiredPermissionName: MdmServicePermissions.CompanyMasters.Default
			).RequireFeatures(MdmFeatures.CompanyMaster)
		);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.VATs,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:VATs"],
				"/Mdm/VATs",
				icon: "fa fa-file-alt",
				requiredPermissionName: MdmServicePermissions.VATs.Default
			).RequireFeatures(MdmFeatures.VATs)
		);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.SalesChannels,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:SalesChannels"],
				"/Mdm/SalesChannels",
				icon: "fa fa-file-alt",
				requiredPermissionName: MdmServicePermissions.SalesChannels.Default
			).RequireFeatures(MdmFeatures.SalesChannels)
		);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.CompanyIdentityUserAssignments,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:CompanyIdentityUserAssignments"],
                "/Mdm/CompanyAssignments",
				icon: "fa fa-user",
				requiredPermissionName: MdmServicePermissions.CompanyIdentityUserAssignments.Default
			).RequireFeatures(MdmFeatures.CompanyIdentityUserAssignments)
		);
	}

	private static void AddMenuProductItems(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
	{
		ApplicationMenuItem groupMenu = new ApplicationMenuItem(
			   MdmServiceMenus.Items,
			   //context.GetLocalizer<OMSResource>()["Menu:MdmService:Product"],
			   context.GetLocalizer<OMSResource>()["Menu:MdmService:GroupMenu:Item"],
			   null,
			   icon: "fa fa-product-hunt"
           )
			.RequirePermissions(false, MdmServicePermissions.UOMs.Default,
				MdmServicePermissions.UOMGroups.Default,
				MdmServicePermissions.UOMGroupDetails.Default,
				MdmServicePermissions.ItemAttributes.Default,
				MdmServicePermissions.Items.Default,
				MdmServicePermissions.ItemGroups.Default,
				MdmServicePermissions.PriceLists.Default,
				MdmServicePermissions.PriceListDetails.Default,
				MdmServicePermissions.PriceUpdates.Default,
				MdmServicePermissions.PriceUpdateDetails.Default,
				MdmServicePermissions.PriceListAssignments.Default)
			.RequireFeatures(false, MdmFeatures.UOMs,
				MdmFeatures.UOMGroups,
				MdmFeatures.ItemAttributes,
				MdmFeatures.Items, MdmFeatures.ItemGroups,
				MdmFeatures.PriceLists, MdmFeatures.PriceUpdate,
				MdmFeatures.PriceListAssignments);

		parentMenu.AddItem(groupMenu);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.UOMs,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:UOMs"],
				"/Mdm/UOMs",
				icon: "fa fa-cube",
				requiredPermissionName: MdmServicePermissions.UOMs.Default
			).RequireFeatures(MdmFeatures.UOMs)
		);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.UOMGroups,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:UOMGroups"],
				"/Mdm/UOMGroups",
				icon: "fa fa-cubes",
				requiredPermissionName: MdmServicePermissions.UOMGroups.Default
			).RequireFeatures(MdmFeatures.UOMGroups)
		);

		//groupMenu.AddItem(
		//   new ApplicationMenuItem(
		//	   MdmServiceMenus.UOMGroupDetails,
		//	   context.GetLocalizer<OMSResource>()["Menu:MdmService:UOMGroupDetails"],
		//	   "/Mdm/UOMGroupDetails",
		//	   icon: "fa fa-file-alt",
		//	   requiredPermissionName: MdmServicePermissions.UOMGroupDetails.Default
		//   ).RequireFeatures(MdmFeatures.UOMGroups)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.ItemAttributes,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:ItemAttributes"],
                "/Mdm/ItemAttributes",
				icon: "fa fa-indent",
				requiredPermissionName: MdmServicePermissions.ItemAttributes.Default
			).RequireFeatures(MdmFeatures.ItemAttributes)
		);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.ItemAttributeValues,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:ItemAttributeValues"],
                "/Mdm/ItemAttributeValues",
				icon: "fa fa-check",
				requiredPermissionName: MdmServicePermissions.ItemAttributeValues.Default
			).RequireFeatures(MdmFeatures.ItemAttributes)
		);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.Items,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:ItemMasters"],
                "/Mdm/ItemMasters",
				icon: "fa fa-folder-open",
				requiredPermissionName: MdmServicePermissions.Items.Default
			).RequireFeatures(MdmFeatures.Items)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.ItemImages,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:ItemImages"],
  //              "/Mdm/ItemImages",
		//		icon: "fa fa-file-image-o",
		//		requiredPermissionName: MdmServicePermissions.Items.Default
		//	).RequireFeatures(MdmFeatures.Items)
		//);

		//parentMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.ItemAttachments,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:ItemAttachments"],
  //              "/Mdm/ItemAttachments",
		//		icon: "fa fa-paperclip",
		//		requiredPermissionName: MdmServicePermissions.Items.Default
		//	).RequireFeatures(MdmFeatures.Items)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.ItemGroups,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:ItemGroups"],
				"/Mdm/ItemGroups",
				icon: "fa fa-object-group",
				requiredPermissionName: MdmServicePermissions.ItemGroups.Default
			).RequireFeatures(MdmFeatures.ItemGroups)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.ItemGroupAttributes,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:ItemGroupAttrs"],
  //              "/Mdm/ItemGroupAttrs",
		//		icon: "fa fa-clone",
		//		requiredPermissionName: MdmServicePermissions.ItemGroups.Default
		//	).RequireFeatures(MdmFeatures.ItemGroups)
		//);

		//parentMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.ItemGroupLists,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:ItemGroupLists"],
  //              "/Mdm/ItemGroupLists",
		//		icon: "fa fa-list-alt",
		//		requiredPermissionName: MdmServicePermissions.ItemGroups.Default
		//	).RequireFeatures(MdmFeatures.ItemGroups)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.PriceLists,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:PriceLists"],
				"/Mdm/PriceLists",
				icon: "fa fa-money",
				requiredPermissionName: MdmServicePermissions.PriceLists.Default
			).RequireFeatures(MdmFeatures.PriceLists)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.PriceListDetails,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:PriceListDetails"],
		//		"/Mdm/PriceListDetails",
		//		icon: "fa fa-list",
		//		requiredPermissionName: MdmServicePermissions.PriceListDetails.Default
		//	).RequireFeatures(MdmFeatures.PriceLists)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.PriceUpdateDefs,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:PriceUpdates"],
				"/Mdm/PriceUpdates",
				icon: "fa fa-pencil-square-o",
				requiredPermissionName: MdmServicePermissions.PriceUpdates.Default
			).RequireFeatures(MdmFeatures.PriceUpdate)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.PriceUpdateDetails,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:PriceUpdateDetails"],
		//		"/Mdm/PriceUpdateDetails",
		//		icon: "fa fa-info-circle",
		//		requiredPermissionName: MdmServicePermissions.PriceUpdateDetails.Default
		//	).RequireFeatures(MdmFeatures.PriceUpdate)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.PriceListAssignments,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:PriceListAssignments"],
				"/Mdm/PricelistAssignments",
				icon: "fa fa-table",
				requiredPermissionName: MdmServicePermissions.PriceListAssignments.Default
			).RequireFeatures(MdmFeatures.PriceListAssignments)
		);
	}

	private static void AddMenuItemSalesOrganizations(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
	{
		ApplicationMenuItem groupMenu = new ApplicationMenuItem(
			   MdmServiceMenus.SalesOrganizations,
			   context.GetLocalizer<OMSResource>()["Menu:MdmService:GroupMenu:SalesOrganization"],
			   null,
			   icon: "fa fa-sitemap"
           )
			.RequirePermissions(false,
				MdmServicePermissions.WorkingPositions.Default,
				MdmServicePermissions.EmployeeProfiles.Default,
				MdmServicePermissions.SalesOrgHeaders.Default,
				MdmServicePermissions.SalesOrgHierarchies.Default,
				MdmServicePermissions.SalesOrgEmpAssignments.Default,
				MdmServicePermissions.CompanyInZones.Default,
				MdmServicePermissions.CustomerInZones.Default,
				MdmServicePermissions.EmployeeInZones.Default)
			.RequireFeatures(false, MdmFeatures.WorkingPositions,
				MdmFeatures.EmployeeProfiles, MdmFeatures.SalesOrgs,
				MdmFeatures.SellingZones);

		parentMenu.AddItem(groupMenu);

        groupMenu.AddItem(
            new ApplicationMenuItem(
                "MdmService.SalesOrganizations.EmployeeTypes",
                context.GetLocalizer<OMSResource>()["Menu:MdmService:EmployeeTypes"],
                "/Mdm/EmployeeTypes",
                icon: "fa fa-users"
            ).RequireFeatures(MdmFeatures.EmployeeProfiles)
        );

        groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.WorkingPositions,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:WorkingPositions"],
				"/Mdm/WorkingPositions",
				icon: "fa fa-archive",
				requiredPermissionName: MdmServicePermissions.WorkingPositions.Default
			).RequireFeatures(MdmFeatures.WorkingPositions)
		);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.EmployeeProfiles,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:EmployeeProfiles"],
				"/Mdm/EmployeeProfiles",
				icon: "fa fa-user",
				requiredPermissionName: MdmServicePermissions.EmployeeProfiles.Default
			).RequireFeatures(MdmFeatures.EmployeeProfiles)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.EmployeeImages,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:EmployeeImages"],
		//		"/Mdm/EmployeeImages",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.EmployeeProfiles.Default
		//	).RequireFeatures(MdmFeatures.EmployeeProfiles)
		//);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.EmployeeAttachments,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:EmployeeAttachments"],
		//		"/Mdm/EmployeeAttachments",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.EmployeeProfiles.Default
		//	).RequireFeatures(MdmFeatures.EmployeeProfiles)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.SalesOrgHeaders,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:SalesOrganization"],
                "/Mdm/SalesOrganization",
				icon: "fa fa-check-square",
				requiredPermissionName: MdmServicePermissions.SalesOrgHeaders.Default
			).RequireFeatures(MdmFeatures.SalesOrgs)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.SalesOrgHierarchies,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:SalesOrgHierarchies"],
		//		"/Mdm/SalesOrgHierarchies",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.SalesOrgHierarchies.Default
		//	).RequireFeatures(MdmFeatures.SalesOrgs)
		//);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.SalesOrgEmpAssignments,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:SalesOrgEmpAssignments"],
		//		"/Mdm/SalesOrgEmpAssignments",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.SalesOrgEmpAssignments.Default
		//	).RequireFeatures(MdmFeatures.SalesOrgs)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.CompanyInZones,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:SellingZones"],
                "/Mdm/SellingZones",
				icon: "fa fa-map-marker",
				requiredPermissionName: MdmServicePermissions.CompanyInZones.Default
            ).RequireFeatures(MdmFeatures.SellingZones)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.CustomerInZones,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:CustomerInZone"],
		//		"/Mdm/CustomerInZones",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: 
		//	).RequireFeatures(MdmFeatures.SellingZones)
		//);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.EmployeeInZones,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:EmployeeInZone"],
		//		"/Mdm/EmployeeInZones",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.EmployeeInZones.Default
		//	).RequireFeatures(MdmFeatures.SellingZones)
		//);
	}

	private static void AddMenuItemCustomers(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
	{
		ApplicationMenuItem groupMenu = new ApplicationMenuItem(
			   MdmServiceMenus.Customers,
			   context.GetLocalizer<OMSResource>()["Menu:MdmService:Customer"],
			   null,
			   icon: "fa fa-user-secret"
           )
			.RequirePermissions(false, MdmServicePermissions.CustomerAttributes.Default,
				MdmServicePermissions.CusAttributeValues.Default,
				MdmServicePermissions.Vendors.Default,
				MdmServicePermissions.CustomerGroups.Default,
				MdmServicePermissions.CustomerGroupByAtts.Default,
				MdmServicePermissions.CustomerGroupByLists.Default,
				MdmServicePermissions.CustomerGroupByGeos.Default,
				MdmServicePermissions.Customers.Default,
				MdmServicePermissions.CustomerAssignments.Default)
			.RequireFeatures(false, MdmFeatures.CustomerAttributes,
				MdmFeatures.CustomerProfiles,
				MdmFeatures.CustomerGroups, MdmFeatures.CustomerAssignments);

		parentMenu.AddItem(groupMenu);

		groupMenu.AddItem(
		   new ApplicationMenuItem(
			   MdmServiceMenus.CustomerAttributeDefs,
			   context.GetLocalizer<OMSResource>()["Menu:MdmService:CustomerAttributes"],
			   "/Mdm/CustomerAttributes",
			   icon: "fa fa-id-card",
			   requiredPermissionName: MdmServicePermissions.CustomerAttributes.Default
		   ).RequireFeatures(MdmFeatures.CustomerAttributes)
		);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.CusAttributeValues,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:CusAttributeValues"],
                "/Mdm/CusAttributeValues",
				icon: "fa fa-check-square",
				requiredPermissionName: MdmServicePermissions.CusAttributeValues.Default
			).RequireFeatures(MdmFeatures.CustomerAttributes)
		);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.CustomerProfiles,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:CustomerProfile"],
                "/Mdm/CustomerProfile",
				icon: "fa fa-user",
				requiredPermissionName: MdmServicePermissions.Customers.Default
			).RequireFeatures(MdmFeatures.CustomerProfiles)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.CustomerContacts,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:CustomerContacts"],
		//		"/Mdm/CustomerContacts",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.Customers.Default
		//	).RequireFeatures(MdmFeatures.CustomerProfiles)
		//);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.CustomerAttachments,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:CustomerAttachments"],
		//		"/Mdm/CustomerAttachments",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.Customers.Default
		//	).RequireFeatures(MdmFeatures.CustomerProfiles)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.Vendors,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:Vendors"],
				"/Mdm/Vendors",
				icon: "fa fa-user-secret",
				requiredPermissionName: MdmServicePermissions.Vendors.Default
			).RequireFeatures(MdmFeatures.Vendors)
		);

		groupMenu.AddItem(
		   new ApplicationMenuItem(
			   MdmServiceMenus.CustomerAssignments,
			   context.GetLocalizer<OMSResource>()["Menu:MdmService:CustomerAssignments"],
			   "/Mdm/CustomerAssignments",
			   icon: "fa fa-tasks",
			   requiredPermissionName: MdmServicePermissions.CustomerAssignments.Default
		   ).RequireFeatures(MdmFeatures.CustomerAssignments)
	   );

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.CustomerGroupDefs,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:CustomerGroups"],
				"/Mdm/CustomerGroups",
				icon: "fa fa-list-alt",
				requiredPermissionName: MdmServicePermissions.CustomerGroups.Default
			).RequireFeatures(MdmFeatures.CustomerGroups)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.CustomerGroupByAtts,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:CustomerGroupsByAtt"],
		//		"/Mdm/CustomerGroupByAtts",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.CustomerGroupByAtts.Default
		//	).RequireFeatures(MdmFeatures.CustomerGroups)
		//);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.CustomerGroupByLists,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:CustomerGroupsByList"],
		//		"/Mdm/CustomerGroupByLists",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.CustomerGroupByLists.Default
		//	).RequireFeatures(MdmFeatures.CustomerGroups)
		//);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.CustomerGroupByGeos,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:CustomerGroupsByGeo"],
		//		"/Mdm/CustomerGroupByGeos",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.CustomerGroupByGeos.Default
		//	).RequireFeatures(MdmFeatures.CustomerGroups)
		//);
	}

	private static void AddMenuItemRouteAndMCP(MenuConfigurationContext context, ApplicationMenuItem parentMenu)
	{
		ApplicationMenuItem groupMenu = new ApplicationMenuItem(
			   MdmServiceMenus.RouteAndMCP,
			   context.GetLocalizer<OMSResource>()["Menu:MdmService:RouteAndMCP"],
			   null,
			   icon: "fa fa-calendar"
           )
			.RequirePermissions(false, MdmServicePermissions.Holidays.Default,
				MdmServicePermissions.HolidayDetails.Default,
				MdmServicePermissions.Routes.Default,
				MdmServicePermissions.MCPs.Default,
				MdmServicePermissions.VisitPlans.Default,
				MdmServicePermissions.RouteAssignments.Default)
			.RequireFeatures(false, MdmFeatures.Holidays, MdmFeatures.Routes,
				MdmFeatures.MCPs, MdmFeatures.VisitPlans, MdmFeatures.RouteAssignments);

		parentMenu.AddItem(groupMenu);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.HolidayDefs,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:Holidays"],
				"/Mdm/Holidays",
				icon: "fa fa-calendar-check-o",
				requiredPermissionName: MdmServicePermissions.Holidays.Default
			).RequireFeatures(MdmFeatures.Holidays)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.HolidayDetails,
		//		context.GetLocalizer<OMSResource>()["Page.Title.HolidayDetails"],
		//		"/Mdm/HolidayDetails",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.HolidayDetails.Default
		//	).RequireFeatures(MdmFeatures.Holidays)
		//);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.Routes,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:Routes"],
		//		"/Mdm/Routes",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.Routes.Default
		//	).RequireFeatures(MdmFeatures.Routes)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.MCPHeaders,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:MCP"],
				"/Mdm/MCPHeaders",
				icon: "fa fa-calendar-minus-o",
				requiredPermissionName: MdmServicePermissions.MCPs.Default
			).RequireFeatures(MdmFeatures.MCPs)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.MCPDetails,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:MCPDetails"],
		//		"/Mdm/MCPDetails",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.MCPDetails.Default
		//	).RequireFeatures(MdmFeatures.MCPs)
		//);

		groupMenu.AddItem(
			new ApplicationMenuItem(
				MdmServiceMenus.VisitPlans,
				context.GetLocalizer<OMSResource>()["Menu:MdmService:VisitPlans"],
				"/Mdm/VisitPlans",
				icon: "fa fa-calendar-check-o",
				requiredPermissionName: MdmServicePermissions.VisitPlans.Default
			).RequireFeatures(MdmFeatures.VisitPlans)
		);

		//groupMenu.AddItem(
		//	new ApplicationMenuItem(
		//		MdmServiceMenus.RouteAssignments,
		//		context.GetLocalizer<OMSResource>()["Menu:MdmService:RouteAssignments"],
		//		"/Mdm/RouteAssignments",
		//		icon: "fa fa-file-alt",
		//		requiredPermissionName: MdmServicePermissions.RouteAssignments.Default
		//	).RequireFeatures(MdmFeatures.RouteAssignments)
		//);
	}
	private Task ConfigureUserMenuAsync(MenuConfigurationContext context)
    {
        var authServerUrl = _configuration["AuthServer:Authority"] ?? "~";
        var uiResource = context.GetLocalizer<AbpUiResource>();
        var accountResource = context.GetLocalizer<AccountResource>();
        context.Menu.AddItem(new ApplicationMenuItem("Account.Manage", accountResource["MyAccount"], $"{authServerUrl.EnsureEndsWith('/')}Account/Manage", icon: "fa fa-cog", order: 1000, null, "_blank").RequireAuthenticated());
        context.Menu.AddItem(new ApplicationMenuItem("Account.SecurityLogs", accountResource["MySecurityLogs"], $"{authServerUrl.EnsureEndsWith('/')}Account/SecurityLogs", target: "_blank").RequireAuthenticated());
        context.Menu.AddItem(new ApplicationMenuItem("Account.Logout", uiResource["Logout"], url: "~/Account/Logout", icon: "fa fa-power-off", order: int.MaxValue - 1000).RequireAuthenticated());

        return Task.CompletedTask;
    }
}
