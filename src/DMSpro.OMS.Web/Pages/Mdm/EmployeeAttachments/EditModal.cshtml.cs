using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.EmployeeAttachments;

namespace DMSpro.OMS.MdmService.Web.Pages.EmployeeAttachments
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public EmployeeAttachmentUpdateViewModel EmployeeAttachment { get; set; }

        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IEmployeeAttachmentsAppService _employeeAttachmentsAppService;

        public EditModalModel(IEmployeeAttachmentsAppService employeeAttachmentsAppService)
        {
            _employeeAttachmentsAppService = employeeAttachmentsAppService;
        }

        public async Task OnGetAsync()
        {
            var employeeAttachmentWithNavigationPropertiesDto = await _employeeAttachmentsAppService.GetWithNavigationPropertiesAsync(Id);
            EmployeeAttachment = ObjectMapper.Map<EmployeeAttachmentDto, EmployeeAttachmentUpdateViewModel>(employeeAttachmentWithNavigationPropertiesDto.EmployeeAttachment);

            EmployeeProfileLookupListRequired.AddRange((
                                    await _employeeAttachmentsAppService.GetEmployeeProfileLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _employeeAttachmentsAppService.UpdateAsync(Id, ObjectMapper.Map<EmployeeAttachmentUpdateViewModel, EmployeeAttachmentUpdateDto>(EmployeeAttachment));
            return NoContent();
        }
    }

    public class EmployeeAttachmentUpdateViewModel : EmployeeAttachmentUpdateDto
    {
    }
}