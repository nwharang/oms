using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.RouteAssignments;

namespace DMSpro.OMS.MdmService.Web.Pages.RouteAssignments
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public RouteAssignmentUpdateViewModel RouteAssignment { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IRouteAssignmentsAppService _routeAssignmentsAppService;

        public EditModalModel(IRouteAssignmentsAppService routeAssignmentsAppService)
        {
            _routeAssignmentsAppService = routeAssignmentsAppService;
        }

        public async Task OnGetAsync()
        {
            var routeAssignmentWithNavigationPropertiesDto = await _routeAssignmentsAppService.GetWithNavigationPropertiesAsync(Id);
            RouteAssignment = ObjectMapper.Map<RouteAssignmentDto, RouteAssignmentUpdateViewModel>(routeAssignmentWithNavigationPropertiesDto.RouteAssignment);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _routeAssignmentsAppService.UpdateAsync(Id, ObjectMapper.Map<RouteAssignmentUpdateViewModel, RouteAssignmentUpdateDto>(RouteAssignment));
            return NoContent();
        }
    }

    public class RouteAssignmentUpdateViewModel : RouteAssignmentUpdateDto
    {
    }
}