using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.CustomerAttachments;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerAttachments
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CustomerAttachmentUpdateViewModel CustomerAttachment { get; set; }

        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerAttachmentsAppService _customerAttachmentsAppService;

        public EditModalModel(ICustomerAttachmentsAppService customerAttachmentsAppService)
        {
            _customerAttachmentsAppService = customerAttachmentsAppService;
        }

        public async Task OnGetAsync()
        {
            var customerAttachmentWithNavigationPropertiesDto = await _customerAttachmentsAppService.GetWithNavigationPropertiesAsync(Id);
            CustomerAttachment = ObjectMapper.Map<CustomerAttachmentDto, CustomerAttachmentUpdateViewModel>(customerAttachmentWithNavigationPropertiesDto.CustomerAttachment);

            CustomerLookupListRequired.AddRange((
                                    await _customerAttachmentsAppService.GetCustomerLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _customerAttachmentsAppService.UpdateAsync(Id, ObjectMapper.Map<CustomerAttachmentUpdateViewModel, CustomerAttachmentUpdateDto>(CustomerAttachment));
            return NoContent();
        }
    }

    public class CustomerAttachmentUpdateViewModel : CustomerAttachmentUpdateDto
    {
    }
}