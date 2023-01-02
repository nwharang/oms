using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.EmployeeImages;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.EmployeeImages
{
    public class IndexModel : AbpPageModel
    {
        public string DescriptionFilter { get; set; }
        public string urlFilter { get; set; }
        [SelectItems(nameof(ActiveBoolFilterItems))]
        public string ActiveFilter { get; set; }

        public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(IsAvatarBoolFilterItems))]
        public string IsAvatarFilter { get; set; }

        public List<SelectListItem> IsAvatarBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(EmployeeProfileLookupList))]
        public Guid EmployeeProfileIdFilter { get; set; }
        public List<SelectListItem> EmployeeProfileLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IEmployeeImagesAppService _employeeImagesAppService;

        public IndexModel(IEmployeeImagesAppService employeeImagesAppService)
        {
            _employeeImagesAppService = employeeImagesAppService;
        }

        public async Task OnGetAsync()
        {
            EmployeeProfileLookupList.AddRange((
                    await _employeeImagesAppService.GetEmployeeProfileLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            await Task.CompletedTask;
        }
    }
}