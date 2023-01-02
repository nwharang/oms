using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.CustomerGroups;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroups
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CustomerGroupUpdateViewModel CustomerGroup { get; set; }

        private readonly ICustomerGroupsAppService _customerGroupsAppService;

        public EditModalModel(ICustomerGroupsAppService customerGroupsAppService)
        {
            _customerGroupsAppService = customerGroupsAppService;
        }

        public async Task OnGetAsync()
        {
            var customerGroup = await _customerGroupsAppService.GetAsync(Id);
            CustomerGroup = ObjectMapper.Map<CustomerGroupDto, CustomerGroupUpdateViewModel>(customerGroup);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _customerGroupsAppService.UpdateAsync(Id, ObjectMapper.Map<CustomerGroupUpdateViewModel, CustomerGroupUpdateDto>(CustomerGroup));
            return NoContent();
        }
    }

    public class CustomerGroupUpdateViewModel : CustomerGroupUpdateDto
    {
    }
}