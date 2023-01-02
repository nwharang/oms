using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.EmployeeInZones;

namespace DMSpro.OMS.MdmService.Web.Pages.EmployeeInZones
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public EmployeeInZoneCreateViewModel EmployeeInZone { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IEmployeeInZonesAppService _employeeInZonesAppService;

        public CreateModalModel(IEmployeeInZonesAppService employeeInZonesAppService)
        {
            _employeeInZonesAppService = employeeInZonesAppService;
        }

        public async Task OnGetAsync()
        {
            EmployeeInZone = new EmployeeInZoneCreateViewModel();
            SalesOrgHierarchyLookupListRequired.AddRange((
                                    await _employeeInZonesAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            EmployeeProfileLookupListRequired.AddRange((
                                    await _employeeInZonesAppService.GetEmployeeProfileLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _employeeInZonesAppService.CreateAsync(ObjectMapper.Map<EmployeeInZoneCreateViewModel, EmployeeInZoneCreateDto>(EmployeeInZone));
            return NoContent();
        }
    }

    public class EmployeeInZoneCreateViewModel : EmployeeInZoneCreateDto
    {
    }
}