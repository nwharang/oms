using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.Customers;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.Customers
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public string NameFilter { get; set; }
        public string Phone1Filter { get; set; }
        public string Phone2Filter { get; set; }
        public string erpCodeFilter { get; set; }
        public string LicenseFilter { get; set; }
        public string TaxCodeFilter { get; set; }
        public string vatNameFilter { get; set; }
        public string vatAddressFilter { get; set; }
        [SelectItems(nameof(ActiveBoolFilterItems))]
        public string ActiveFilter { get; set; }

        public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        public DateTime? EffectiveDateFilterMin { get; set; }

        public DateTime? EffectiveDateFilterMax { get; set; }
        public DateTime? EndDateFilterMin { get; set; }

        public DateTime? EndDateFilterMax { get; set; }
        public int? CreditLimitFilterMin { get; set; }

        public int? CreditLimitFilterMax { get; set; }
        [SelectItems(nameof(IsCompanyBoolFilterItems))]
        public string IsCompanyFilter { get; set; }

        public List<SelectListItem> IsCompanyBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        public string WarehouseIdFilter { get; set; }
        public string StreetFilter { get; set; }
        public string AddressFilter { get; set; }
        public string LatitudeFilter { get; set; }
        public string LongitudeFilter { get; set; }
        public string SFACustomerCodeFilter { get; set; }
        public DateTime? LastOrderDateFilterMin { get; set; }

        public DateTime? LastOrderDateFilterMax { get; set; }
        [SelectItems(nameof(SystemDataLookupList))]
        public Guid? PaymentTermIdFilter { get; set; }
        public List<SelectListItem> SystemDataLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(CompanyLookupList))]
        public Guid? LinkedCompanyIdFilter { get; set; }
        public List<SelectListItem> CompanyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(PriceListLookupList))]
        public Guid PriceListIdFilter { get; set; }
        public List<SelectListItem> PriceListLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(GeoMasterLookupList))]
        public Guid? GeoMaster0IdFilter { get; set; }
        public List<SelectListItem> GeoMasterLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(GeoMasterLookupList))]
        public Guid? GeoMaster1IdFilter { get; set; }
        [SelectItems(nameof(GeoMasterLookupList))]
        public Guid? GeoMaster2IdFilter { get; set; }
        [SelectItems(nameof(GeoMasterLookupList))]
        public Guid? GeoMaster3IdFilter { get; set; }
        [SelectItems(nameof(GeoMasterLookupList))]
        public Guid? GeoMaster4IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute0IdFilter { get; set; }
        public List<SelectListItem> CusAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute1IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute2IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute3IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute4IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute5IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute6IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute7IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute8IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute9IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute10IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute11IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute12IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute13IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute14IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute15IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute16IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute1I7dFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute18IdFilter { get; set; }
        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? Attribute19IdFilter { get; set; }
        [SelectItems(nameof(CustomerLookupList))]
        public Guid? PaymentIdFilter { get; set; }
        public List<SelectListItem> CustomerLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly ICustomersAppService _customersAppService;

        public IndexModel(ICustomersAppService customersAppService)
        {
            _customersAppService = customersAppService;
        }

        public async Task OnGetAsync()
        {
            SystemDataLookupList.AddRange((
                    await _customersAppService.GetSystemDataLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            CompanyLookupList.AddRange((
                            await _customersAppService.GetCompanyLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            PriceListLookupList.AddRange((
                            await _customersAppService.GetPriceListLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            GeoMasterLookupList.AddRange((
                            await _customersAppService.GetGeoMasterLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            CusAttributeValueLookupList.AddRange((
                            await _customersAppService.GetCusAttributeValueLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            CustomerLookupList.AddRange((
                            await _customersAppService.GetCustomerLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}