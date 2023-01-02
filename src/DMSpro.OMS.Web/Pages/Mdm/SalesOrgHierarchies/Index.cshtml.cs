using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.SalesOrgHierarchies;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.SalesOrgHierarchies
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public string NameFilter { get; set; }
        public int? LevelFilterMin { get; set; }

        public int? LevelFilterMax { get; set; }
        [SelectItems(nameof(IsRouteBoolFilterItems))]
        public string IsRouteFilter { get; set; }

        public List<SelectListItem> IsRouteBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(IsSellingZoneBoolFilterItems))]
        public string IsSellingZoneFilter { get; set; }

        public List<SelectListItem> IsSellingZoneBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        public string HierarchyCodeFilter { get; set; }
        [SelectItems(nameof(ActiveBoolFilterItems))]
        public string ActiveFilter { get; set; }

        public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(SalesOrgHeaderLookupList))]
        public Guid SalesOrgHeaderIdFilter { get; set; }
        public List<SelectListItem> SalesOrgHeaderLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(SalesOrgHierarchyLookupList))]
        public Guid? ParentIdFilter { get; set; }
        public List<SelectListItem> SalesOrgHierarchyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly ISalesOrgHierarchiesAppService _salesOrgHierarchiesAppService;

        public IndexModel(ISalesOrgHierarchiesAppService salesOrgHierarchiesAppService)
        {
            _salesOrgHierarchiesAppService = salesOrgHierarchiesAppService;
        }

        public async Task OnGetAsync()
        {
            SalesOrgHeaderLookupList.AddRange((
                    await _salesOrgHierarchiesAppService.GetSalesOrgHeaderLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            SalesOrgHierarchyLookupList.AddRange((
                            await _salesOrgHierarchiesAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}