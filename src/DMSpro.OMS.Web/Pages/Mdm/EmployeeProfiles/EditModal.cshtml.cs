using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.EmployeeProfiles;

namespace DMSpro.OMS.MdmService.Web.Pages.EmployeeProfiles
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public EmployeeProfileUpdateViewModel EmployeeProfile { get; set; }

        public List<SelectListItem> WorkingPositionLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };
        public List<SelectListItem> SystemDataLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly IEmployeeProfilesAppService _employeeProfilesAppService;

        public EditModalModel(IEmployeeProfilesAppService employeeProfilesAppService)
        {
            _employeeProfilesAppService = employeeProfilesAppService;
        }

        public async Task OnGetAsync()
        {
            var employeeProfileWithNavigationPropertiesDto = await _employeeProfilesAppService.GetWithNavigationPropertiesAsync(Id);
            EmployeeProfile = ObjectMapper.Map<EmployeeProfileDto, EmployeeProfileUpdateViewModel>(employeeProfileWithNavigationPropertiesDto.EmployeeProfile);

            WorkingPositionLookupList.AddRange((
                                    await _employeeProfilesAppService.GetWorkingPositionLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            SystemDataLookupList.AddRange((
                                    await _employeeProfilesAppService.GetSystemDataLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _employeeProfilesAppService.UpdateAsync(Id, ObjectMapper.Map<EmployeeProfileUpdateViewModel, EmployeeProfileUpdateDto>(EmployeeProfile));
            return NoContent();
        }
    }

    public class EmployeeProfileUpdateViewModel : EmployeeProfileUpdateDto
    {
    }
}