using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CustomerContacts;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerContacts
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CustomerContactCreateViewModel CustomerContact { get; set; }

        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerContactsAppService _customerContactsAppService;

        public CreateModalModel(ICustomerContactsAppService customerContactsAppService)
        {
            _customerContactsAppService = customerContactsAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerContact = new CustomerContactCreateViewModel();
            CustomerLookupListRequired.AddRange((
                                    await _customerContactsAppService.GetCustomerLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _customerContactsAppService.CreateAsync(ObjectMapper.Map<CustomerContactCreateViewModel, CustomerContactCreateDto>(CustomerContact));
            return NoContent();
        }
    }

    public class CustomerContactCreateViewModel : CustomerContactCreateDto
    {
    }
}