using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.SalesOrgEmpAssignments;

namespace DMSpro.OMS.MdmService.Web.Pages.SalesOrgEmpAssignments
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public SalesOrgEmpAssignmentCreateViewModel SalesOrgEmpAssignment { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ISalesOrgEmpAssignmentsAppService _salesOrgEmpAssignmentsAppService;

        public CreateModalModel(ISalesOrgEmpAssignmentsAppService salesOrgEmpAssignmentsAppService)
        {
            _salesOrgEmpAssignmentsAppService = salesOrgEmpAssignmentsAppService;
        }

        public async Task OnGetAsync()
        {
            SalesOrgEmpAssignment = new SalesOrgEmpAssignmentCreateViewModel();
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

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _salesOrgEmpAssignmentsAppService.CreateAsync(ObjectMapper.Map<SalesOrgEmpAssignmentCreateViewModel, SalesOrgEmpAssignmentCreateDto>(SalesOrgEmpAssignment));
            return NoContent();
        }
    }

    public class SalesOrgEmpAssignmentCreateViewModel : SalesOrgEmpAssignmentCreateDto
    {
    }
}