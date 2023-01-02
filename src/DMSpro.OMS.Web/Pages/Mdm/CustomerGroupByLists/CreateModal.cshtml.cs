using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CustomerGroupByLists;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroupByLists
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CustomerGroupByListCreateViewModel CustomerGroupByList { get; set; }

        public List<SelectListItem> CustomerGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerGroupByListsAppService _customerGroupByListsAppService;

        public CreateModalModel(ICustomerGroupByListsAppService customerGroupByListsAppService)
        {
            _customerGroupByListsAppService = customerGroupByListsAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerGroupByList = new CustomerGroupByListCreateViewModel();
            CustomerGroupLookupListRequired.AddRange((
                                    await _customerGroupByListsAppService.GetCustomerGroupLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            CustomerLookupListRequired.AddRange((
                                    await _customerGroupByListsAppService.GetCustomerLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _customerGroupByListsAppService.CreateAsync(ObjectMapper.Map<CustomerGroupByListCreateViewModel, CustomerGroupByListCreateDto>(CustomerGroupByList));
            return NoContent();
        }
    }

    public class CustomerGroupByListCreateViewModel : CustomerGroupByListCreateDto
    {
    }
}