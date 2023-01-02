using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.Routes;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.Routes
{
    public class IndexModel : AbpPageModel
    {
        [SelectItems(nameof(CheckInBoolFilterItems))]
        public string CheckInFilter { get; set; }

        public List<SelectListItem> CheckInBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(CheckOutBoolFilterItems))]
        public string CheckOutFilter { get; set; }

        public List<SelectListItem> CheckOutBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(GPSLockBoolFilterItems))]
        public string GPSLockFilter { get; set; }

        public List<SelectListItem> GPSLockBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(OutRouteBoolFilterItems))]
        public string OutRouteFilter { get; set; }

        public List<SelectListItem> OutRouteBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(SystemDataLookupList))]
        public Guid RouteTypeIdFilter { get; set; }
        public List<SelectListItem> SystemDataLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(ItemGroupLookupList))]
        public Guid ItemGroupIdFilter { get; set; }
        public List<SelectListItem> ItemGroupLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(SalesOrgHierarchyLookupList))]
        public Guid SalesOrgHierarchyIdFilter { get; set; }
        public List<SelectListItem> SalesOrgHierarchyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IRoutesAppService _routesAppService;

        public IndexModel(IRoutesAppService routesAppService)
        {
            _routesAppService = routesAppService;
        }

        public async Task OnGetAsync()
        {
            SystemDataLookupList.AddRange((
                    await _routesAppService.GetSystemDataLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            ItemGroupLookupList.AddRange((
                            await _routesAppService.GetItemGroupLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            SalesOrgHierarchyLookupList.AddRange((
                            await _routesAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}