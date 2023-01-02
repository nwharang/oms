using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.RouteAssignments;

namespace DMSpro.OMS.MdmService.Web.Pages.RouteAssignments
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public RouteAssignmentCreateViewModel RouteAssignment { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IRouteAssignmentsAppService _routeAssignmentsAppService;

        public CreateModalModel(IRouteAssignmentsAppService routeAssignmentsAppService)
        {
            _routeAssignmentsAppService = routeAssignmentsAppService;
        }

        public async Task OnGetAsync()
        {
            RouteAssignment = new RouteAssignmentCreateViewModel();
            SalesOrgHierarchyLookupListRequired.AddRange((
                                    await _routeAssignmentsAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            EmployeeProfileLookupListRequired.AddRange((
                                    await _routeAssignmentsAppService.GetEmployeeProfileLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _routeAssignmentsAppService.CreateAsync(ObjectMapper.Map<RouteAssignmentCreateViewModel, RouteAssignmentCreateDto>(RouteAssignment));
            return NoContent();
        }
    }

    public class RouteAssignmentCreateViewModel : RouteAssignmentCreateDto
    {
    }
}