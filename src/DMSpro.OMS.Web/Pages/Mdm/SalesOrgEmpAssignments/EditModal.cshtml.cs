using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.SalesOrgEmpAssignments;

namespace DMSpro.OMS.MdmService.Web.Pages.SalesOrgEmpAssignments
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public SalesOrgEmpAssignmentUpdateViewModel SalesOrgEmpAssignment { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ISalesOrgEmpAssignmentsAppService _salesOrgEmpAssignmentsAppService;

        public EditModalModel(ISalesOrgEmpAssignmentsAppService salesOrgEmpAssignmentsAppService)
        {
            _salesOrgEmpAssignmentsAppService = salesOrgEmpAssignmentsAppService;
        }

        public async Task OnGetAsync()
        {
            var salesOrgEmpAssignmentWithNavigationPropertiesDto = await _salesOrgEmpAssignmentsAppService.GetWithNavigationPropertiesAsync(Id);
            SalesOrgEmpAssignment = ObjectMapper.Map<SalesOrgEmpAssignmentDto, SalesOrgEmpAssignmentUpdateViewModel>(salesOrgEmpAssignmentWithNavigationPropertiesDto.SalesOrgEmpAssignment);

            SalesOrgHierarchyLookupListRequired.AddRange((
                                    await _salesOrgEmpAssignmentsAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            EmployeeProfileLookupListRequired.AddRange((
                                    await _salesOrgEmpAssignmentsAppService.GetEmployeeProfileLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _salesOrgEmpAssignmentsAppService.UpdateAsync(Id, ObjectMapper.Map<SalesOrgEmpAssignmentUpdateViewModel, SalesOrgEmpAssignmentUpdateDto>(SalesOrgEmpAssignment));
            return NoContent();
        }
    }

    public class SalesOrgEmpAssignmentUpdateViewModel : SalesOrgEmpAssignmentUpdateDto
    {
    }
}