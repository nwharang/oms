namespace DMSpro.OMS.Web.Navigation;

public class MdmServiceMenus
{
    public const string Prefix = "MdmService";

    public const string Administration = Prefix + ".Administration";
    public const string SystemData = Administration + ".SystemData";
    public const string SystemConfig = Administration + ".SystemConfig";
    public const string NumberingConfig = Administration + ".NumberingConfig";

    public const string Geographical = Prefix + ".Geographical";
    public const string GeoMasters = Geographical + ".GeoMasters";
    public const string Streets = Geographical + ".Streets";
    public const string Maps = Geographical + ".Maps";

    public const string Companies = Prefix + ".Companies";
    public const string CompanyMaster = Companies + ".CompanyMasters";
    public const string Currencies = Companies + ".Currencies";
    public const string DimensionMeasurements = Companies + ".DimensionMeasurements";
    public const string WeightMeasurements = Companies + ".WeightMeasurements";
    public const string VATs = Companies + ".VATs";
    public const string SalesChannels = Companies + ".SalesChannels";
    public const string CompanyIdentityUserAssignments = Companies + ".CompanyIdentityUserAssignments";

    public const string ItemMaster = Prefix + ".ItemMaster";
    public const string UOMs = ItemMaster + ".UOMs";
    public const string UOMGroups = ItemMaster + ".UOMGroups";
    public const string UOMGroupDetails = ItemMaster + ".UOMGroupDetails";
    public const string ItemAttributes = ItemMaster + ".ItemAttributes";
    public const string ItemAttributeValues = ItemMaster + ".ItemAttributeValues";
    public const string Items = ItemMaster + ".Items";
    public const string ItemImages = ItemMaster + ".ItemImages";
    public const string ItemAttachments = ItemMaster + ".ItemAttachments";
    public const string ItemGroups = ItemMaster + ".ItemGroups";
    public const string PriceLists = ItemMaster + ".PriceLists";
    public const string PriceListDetails = ItemMaster + ".PriceListDetails";
    public const string PriceUpdates = ItemMaster + ".PriceUpdates";
    public const string PriceUpdateDetails = ItemMaster + ".PriceUpdateDetails";
    public const string PriceListAssignments = ItemMaster + ".PriceAssignments";

    public const string SalesOrganizations = Prefix + ".SalesOrganizations";
    public const string WorkingPositions = SalesOrganizations + ".WorkingPositions";
    public const string EmployeeProfiles = SalesOrganizations + ".EmployeeProfiles";
    public const string SalesOrgs = SalesOrganizations + ".SalesOrgs";
    public const string SalesOrgHeaders = SalesOrgs + ".SalesOrgHeaders";
    public const string SalesOrgHierarchies = Prefix + ".SalesOrgHierarchies";
    public const string SalesOrgEmpAssignments = SalesOrgs + ".SalesOrgEmpAssignments";
    public const string SellingZones = SalesOrganizations + ".SellingZones";
    public const string CompanyInZones = SellingZones + ".CompanyInZones";
    public const string CustomerInZones = SellingZones + ".CustomerInZones";
    public const string EmployeeInZones = SellingZones + ".EmployeeInZones";

    public const string Customers = Prefix + ".Customers";
    public const string CustomerAttributes = Customers + ".CustomerAttributes";
    public const string CustomerAttributeValues = Customers + ".CustomerAttributeValues";
    public const string CustomerProfiles = Customers + ".CustomerProfiles";
    public const string CustomerContacts = Customers + ".CustomerContacts";
    public const string CustomerAttachments = Customers + ".CustomerAttachments";
    public const string Vendors = Customers + ".Vendors";
    public const string CustomerGroups = Customers + ".CustomerGroups";
    public const string CustomerAssignments = Customers + ".CustomerAssignments";

    public const string RouteAndMCP = Prefix + ".RoutesAndMCPs";
    public const string Holidays = RouteAndMCP + ".Holidays";
    public const string HolidayDetails = RouteAndMCP + ".HolidayDetails";
    public const string Routes = RouteAndMCP + ".Routes";
    public const string MCPHeaders = RouteAndMCP + ".MCPHeader";
    public const string MCPDetails = RouteAndMCP + ".MCPDetail";
    public const string VisitPlans = RouteAndMCP + ".VisitPlans";
    public const string RouteAssignments = RouteAndMCP + ".RouteAssignments";
}