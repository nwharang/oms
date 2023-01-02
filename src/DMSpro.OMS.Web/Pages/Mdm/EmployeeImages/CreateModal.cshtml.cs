using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.EmployeeImages;

namespace DMSpro.OMS.MdmService.Web.Pages.EmployeeImages
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public EmployeeImageCreateViewModel EmployeeImage { get; set; }

        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IEmployeeImagesAppService _employeeImagesAppService;

        public CreateModalModel(IEmployeeImagesAppService employeeImagesAppService)
        {
            _employeeImagesAppService = employeeImagesAppService;
        }

        public async Task OnGetAsync()
        {
            EmployeeImage = new EmployeeImageCreateViewModel();
            EmployeeProfileLookupListRequired.AddRange((
                                    await _employeeImagesAppService.GetEmployeeProfileLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _employeeImagesAppService.CreateAsync(ObjectMapper.Map<EmployeeImageCreateViewModel, EmployeeImageCreateDto>(EmployeeImage));
            return NoContent();
        }
    }

    public class EmployeeImageCreateViewModel : EmployeeImageCreateDto
    {
    }
}