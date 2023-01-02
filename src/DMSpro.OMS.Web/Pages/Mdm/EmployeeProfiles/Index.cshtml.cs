using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.EmployeeProfiles;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.EmployeeProfiles
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public string ERPCodeFilter { get; set; }
        public string FirstNameFilter { get; set; }
        public string LastNameFilter { get; set; }
        public DateTime? DateOfBirthFilterMin { get; set; }

        public DateTime? DateOfBirthFilterMax { get; set; }
        public string IdCardNumberFilter { get; set; }
        public string EmailFilter { get; set; }
        public string PhoneFilter { get; set; }
        public string AddressFilter { get; set; }
        [SelectItems(nameof(ActiveBoolFilterItems))]
        public string ActiveFilter { get; set; }

        public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        public DateTime? EffectiveDateFilterMin { get; set; }

        public DateTime? EffectiveDateFilterMax { get; set; }
        public DateTime? EndDateFilterMin { get; set; }

        public DateTime? EndDateFilterMax { get; set; }
        public string IdentityUserIdFilter { get; set; }
        [SelectItems(nameof(WorkingPositionLookupList))]
        public Guid? WorkingPositionIdFilter { get; set; }
        public List<SelectListItem> WorkingPositionLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(SystemDataLookupList))]
        public Guid? EmployeeTypeIdFilter { get; set; }
        public List<SelectListItem> SystemDataLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IEmployeeProfilesAppService _employeeProfilesAppService;

        public IndexModel(IEmployeeProfilesAppService employeeProfilesAppService)
        {
            _employeeProfilesAppService = employeeProfilesAppService;
        }

        public async Task OnGetAsync()
        {
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
    }
}