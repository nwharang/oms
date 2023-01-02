using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CustomerAttributes;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerAttributes
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CustomerAttributeCreateViewModel CustomerAttribute { get; set; }

        private readonly ICustomerAttributesAppService _customerAttributesAppService;

        public CreateModalModel(ICustomerAttributesAppService customerAttributesAppService)
        {
            _customerAttributesAppService = customerAttributesAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerAttribute = new CustomerAttributeCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _customerAttributesAppService.CreateAsync(ObjectMapper.Map<CustomerAttributeCreateViewModel, CustomerAttributeCreateDto>(CustomerAttribute));
            return NoContent();
        }
    }

    public class CustomerAttributeCreateViewModel : CustomerAttributeCreateDto
    {
    }
}