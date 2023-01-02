using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.CustomerAttributes;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerAttributes
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CustomerAttributeUpdateViewModel CustomerAttribute { get; set; }

        private readonly ICustomerAttributesAppService _customerAttributesAppService;

        public EditModalModel(ICustomerAttributesAppService customerAttributesAppService)
        {
            _customerAttributesAppService = customerAttributesAppService;
        }

        public async Task OnGetAsync()
        {
            var customerAttribute = await _customerAttributesAppService.GetAsync(Id);
            CustomerAttribute = ObjectMapper.Map<CustomerAttributeDto, CustomerAttributeUpdateViewModel>(customerAttribute);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _customerAttributesAppService.UpdateAsync(Id, ObjectMapper.Map<CustomerAttributeUpdateViewModel, CustomerAttributeUpdateDto>(CustomerAttribute));
            return NoContent();
        }
    }

    public class CustomerAttributeUpdateViewModel : CustomerAttributeUpdateDto
    {
    }
}