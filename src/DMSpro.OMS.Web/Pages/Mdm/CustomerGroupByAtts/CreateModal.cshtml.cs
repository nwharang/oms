using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CustomerGroupByAtts;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroupByAtts
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CustomerGroupByAttCreateViewModel CustomerGroupByAtt { get; set; }

        public List<SelectListItem> CustomerGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CusAttributeValueLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerGroupByAttsAppService _customerGroupByAttsAppService;

        public CreateModalModel(ICustomerGroupByAttsAppService customerGroupByAttsAppService)
        {
            _customerGroupByAttsAppService = customerGroupByAttsAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerGroupByAtt = new CustomerGroupByAttCreateViewModel();
            CustomerGroupLookupListRequired.AddRange((
                                    await _customerGroupByAttsAppService.GetCustomerGroupLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            CusAttributeValueLookupListRequired.AddRange((
                                    await _customerGroupByAttsAppService.GetCusAttributeValueLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _customerGroupByAttsAppService.CreateAsync(ObjectMapper.Map<CustomerGroupByAttCreateViewModel, CustomerGroupByAttCreateDto>(CustomerGroupByAtt));
            return NoContent();
        }
    }

    public class CustomerGroupByAttCreateViewModel : CustomerGroupByAttCreateDto
    {
    }
}