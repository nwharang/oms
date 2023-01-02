using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.EmployeeImages;

namespace DMSpro.OMS.MdmService.Web.Pages.EmployeeImages
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public EmployeeImageUpdateViewModel EmployeeImage { get; set; }

        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IEmployeeImagesAppService _employeeImagesAppService;

        public EditModalModel(IEmployeeImagesAppService employeeImagesAppService)
        {
            _employeeImagesAppService = employeeImagesAppService;
        }

        public async Task OnGetAsync()
        {
            var employeeImageWithNavigationPropertiesDto = await _employeeImagesAppService.GetWithNavigationPropertiesAsync(Id);
            EmployeeImage = ObjectMapper.Map<EmployeeImageDto, EmployeeImageUpdateViewModel>(employeeImageWithNavigationPropertiesDto.EmployeeImage);

            EmployeeProfileLookupListRequired.AddRange((
                                    await _employeeImagesAppService.GetEmployeeProfileLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _employeeImagesAppService.UpdateAsync(Id, ObjectMapper.Map<EmployeeImageUpdateViewModel, EmployeeImageUpdateDto>(EmployeeImage));
            return NoContent();
        }
    }

    public class EmployeeImageUpdateViewModel : EmployeeImageUpdateDto
    {
    }
}