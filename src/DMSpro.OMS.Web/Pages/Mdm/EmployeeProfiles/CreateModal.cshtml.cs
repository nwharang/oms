using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.EmployeeProfiles;

namespace DMSpro.OMS.MdmService.Web.Pages.EmployeeProfiles
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public EmployeeProfileCreateViewModel EmployeeProfile { get; set; }

        public List<SelectListItem> WorkingPositionLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };
        public List<SelectListItem> SystemDataLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly IEmployeeProfilesAppService _employeeProfilesAppService;

        public CreateModalModel(IEmployeeProfilesAppService employeeProfilesAppService)
        {
            _employeeProfilesAppService = employeeProfilesAppService;
        }

        public async Task OnGetAsync()
        {
            EmployeeProfile = new EmployeeProfileCreateViewModel();
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

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _employeeProfilesAppService.CreateAsync(ObjectMapper.Map<EmployeeProfileCreateViewModel, EmployeeProfileCreateDto>(EmployeeProfile));
            return NoContent();
        }
    }

    public class EmployeeProfileCreateViewModel : EmployeeProfileCreateDto
    {
    }
}