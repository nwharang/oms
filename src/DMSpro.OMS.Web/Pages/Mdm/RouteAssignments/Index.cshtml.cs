using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.RouteAssignments;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.RouteAssignments
{
    public class IndexModel : AbpPageModel
    {
        public DateTime? EffectiveDateFilterMin { get; set; }

        public DateTime? EffectiveDateFilterMax { get; set; }
        public DateTime? EndDateFilterMin { get; set; }

        public DateTime? EndDateFilterMax { get; set; }
        [SelectItems(nameof(SalesOrgHierarchyLookupList))]
        public Guid RouteIdFilter { get; set; }
        public List<SelectListItem> SalesOrgHierarchyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(EmployeeProfileLookupList))]
        public Guid EmployeeIdFilter { get; set; }
        public List<SelectListItem> EmployeeProfileLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IRouteAssignmentsAppService _routeAssignmentsAppService;

        public IndexModel(IRouteAssignmentsAppService routeAssignmentsAppService)
        {
            _routeAssignmentsAppService = routeAssignmentsAppService;
        }

        public async Task OnGetAsync()
        {
            SalesOrgHierarchyLookupList.AddRange((
                    await _routeAssignmentsAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            EmployeeProfileLookupList.AddRange((
                            await _routeAssignmentsAppService.GetEmployeeProfileLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}