using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.EmployeeInZones;

namespace DMSpro.OMS.MdmService.Web.Pages.EmployeeInZones
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public EmployeeInZoneUpdateViewModel EmployeeInZone { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IEmployeeInZonesAppService _employeeInZonesAppService;

        public EditModalModel(IEmployeeInZonesAppService employeeInZonesAppService)
        {
            _employeeInZonesAppService = employeeInZonesAppService;
        }

        public async Task OnGetAsync()
        {
            var employeeInZoneWithNavigationPropertiesDto = await _employeeInZonesAppService.GetWithNavigationPropertiesAsync(Id);
            EmployeeInZone = ObjectMapper.Map<EmployeeInZoneDto, EmployeeInZoneUpdateViewModel>(employeeInZoneWithNavigationPropertiesDto.EmployeeInZone);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _employeeInZonesAppService.UpdateAsync(Id, ObjectMapper.Map<EmployeeInZoneUpdateViewModel, EmployeeInZoneUpdateDto>(EmployeeInZone));
            return NoContent();
        }
    }

    public class EmployeeInZoneUpdateViewModel : EmployeeInZoneUpdateDto
    {
    }
}