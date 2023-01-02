using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.CustomerContacts;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerContacts
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CustomerContactUpdateViewModel CustomerContact { get; set; }

        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerContactsAppService _customerContactsAppService;

        public EditModalModel(ICustomerContactsAppService customerContactsAppService)
        {
            _customerContactsAppService = customerContactsAppService;
        }

        public async Task OnGetAsync()
        {
            var customerContactWithNavigationPropertiesDto = await _customerContactsAppService.GetWithNavigationPropertiesAsync(Id);
            CustomerContact = ObjectMapper.Map<CustomerContactDto, CustomerContactUpdateViewModel>(customerContactWithNavigationPropertiesDto.CustomerContact);

            CustomerLookupListRequired.AddRange((
                                    await _customerContactsAppService.GetCustomerLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _customerContactsAppService.UpdateAsync(Id, ObjectMapper.Map<CustomerContactUpdateViewModel, CustomerContactUpdateDto>(CustomerContact));
            return NoContent();
        }
    }

    public class CustomerContactUpdateViewModel : CustomerContactUpdateDto
    {
    }
}