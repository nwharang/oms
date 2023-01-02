using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.EmployeeAttachments;

namespace DMSpro.OMS.MdmService.Web.Pages.EmployeeAttachments
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public EmployeeAttachmentCreateViewModel EmployeeAttachment { get; set; }

        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IEmployeeAttachmentsAppService _employeeAttachmentsAppService;

        public CreateModalModel(IEmployeeAttachmentsAppService employeeAttachmentsAppService)
        {
            _employeeAttachmentsAppService = employeeAttachmentsAppService;
        }

        public async Task OnGetAsync()
        {
            EmployeeAttachment = new EmployeeAttachmentCreateViewModel();
            EmployeeProfileLookupListRequired.AddRange((
                                    await _employeeAttachmentsAppService.GetEmployeeProfileLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _employeeAttachmentsAppService.CreateAsync(ObjectMapper.Map<EmployeeAttachmentCreateViewModel, EmployeeAttachmentCreateDto>(EmployeeAttachment));
            return NoContent();
        }
    }

    public class EmployeeAttachmentCreateViewModel : EmployeeAttachmentCreateDto
    {
    }
}