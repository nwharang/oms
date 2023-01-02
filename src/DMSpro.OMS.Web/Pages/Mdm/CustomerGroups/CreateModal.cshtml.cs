using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CustomerGroups;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroups
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CustomerGroupCreateViewModel CustomerGroup { get; set; }

        private readonly ICustomerGroupsAppService _customerGroupsAppService;

        public CreateModalModel(ICustomerGroupsAppService customerGroupsAppService)
        {
            _customerGroupsAppService = customerGroupsAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerGroup = new CustomerGroupCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _customerGroupsAppService.CreateAsync(ObjectMapper.Map<CustomerGroupCreateViewModel, CustomerGroupCreateDto>(CustomerGroup));
            return NoContent();
        }
    }

    public class CustomerGroupCreateViewModel : CustomerGroupCreateDto
    {
    }
}