using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.Vendors;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.Vendors
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public string NameFilter { get; set; }
        public string ShortNameFilter { get; set; }
        public string Phone1Filter { get; set; }
        public string Phone2Filter { get; set; }
        public string ERPCodeFilter { get; set; }
        [SelectItems(nameof(ActiveBoolFilterItems))]
        public string ActiveFilter { get; set; }

        public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        public DateTime? EndDateFilterMin { get; set; }

        public DateTime? EndDateFilterMax { get; set; }
        public string WarehouseIdFilter { get; set; }
        public string StreetFilter { get; set; }
        public string AddressFilter { get; set; }
        public string LatitudeFilter { get; set; }
        public string LongitudeFilter { get; set; }
        [SelectItems(nameof(CompanyLookupList))]
        public Guid LinkedCompanyIdFilter { get; set; }
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

        private readonly IVendorsAppService _vendorsAppService;

        public IndexModel(IVendorsAppService vendorsAppService)
        {
            _vendorsAppService = vendorsAppService;
        }

        public async Task OnGetAsync()
        {
            CompanyLookupList.AddRange((
                    await _vendorsAppService.GetCompanyLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            PriceListLookupList.AddRange((
                            await _vendorsAppService.GetPriceListLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            GeoMasterLookupList.AddRange((
                            await _vendorsAppService.GetGeoMasterLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}