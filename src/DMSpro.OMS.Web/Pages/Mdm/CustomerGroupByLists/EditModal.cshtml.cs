using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.CustomerGroupByLists;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroupByLists
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CustomerGroupByListUpdateViewModel CustomerGroupByList { get; set; }

        public List<SelectListItem> CustomerGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerGroupByListsAppService _customerGroupByListsAppService;

        public EditModalModel(ICustomerGroupByListsAppService customerGroupByListsAppService)
        {
            _customerGroupByListsAppService = customerGroupByListsAppService;
        }

        public async Task OnGetAsync()
        {
            var customerGroupByListWithNavigationPropertiesDto = await _customerGroupByListsAppService.GetWithNavigationPropertiesAsync(Id);
            CustomerGroupByList = ObjectMapper.Map<CustomerGroupByListDto, CustomerGroupByListUpdateViewModel>(customerGroupByListWithNavigationPropertiesDto.CustomerGroupByList);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _customerGroupByListsAppService.UpdateAsync(Id, ObjectMapper.Map<CustomerGroupByListUpdateViewModel, CustomerGroupByListUpdateDto>(CustomerGroupByList));
            return NoContent();
        }
    }

    public class CustomerGroupByListUpdateViewModel : CustomerGroupByListUpdateDto
    {
    }
}