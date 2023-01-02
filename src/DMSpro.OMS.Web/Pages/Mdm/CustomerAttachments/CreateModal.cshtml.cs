using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CustomerAttachments;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerAttachments
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CustomerAttachmentCreateViewModel CustomerAttachment { get; set; }

        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerAttachmentsAppService _customerAttachmentsAppService;

        public CreateModalModel(ICustomerAttachmentsAppService customerAttachmentsAppService)
        {
            _customerAttachmentsAppService = customerAttachmentsAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerAttachment = new CustomerAttachmentCreateViewModel();
            CustomerLookupListRequired.AddRange((
                                    await _customerAttachmentsAppService.GetCustomerLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _customerAttachmentsAppService.CreateAsync(ObjectMapper.Map<CustomerAttachmentCreateViewModel, CustomerAttachmentCreateDto>(CustomerAttachment));
            return NoContent();
        }
    }

    public class CustomerAttachmentCreateViewModel : CustomerAttachmentCreateDto
    {
    }
}