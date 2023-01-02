using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.CustomerGroupByAtts;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroupByAtts
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CustomerGroupByAttUpdateViewModel CustomerGroupByAtt { get; set; }

        public List<SelectListItem> CustomerGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CusAttributeValueLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerGroupByAttsAppService _customerGroupByAttsAppService;

        public EditModalModel(ICustomerGroupByAttsAppService customerGroupByAttsAppService)
        {
            _customerGroupByAttsAppService = customerGroupByAttsAppService;
        }

        public async Task OnGetAsync()
        {
            var customerGroupByAttWithNavigationPropertiesDto = await _customerGroupByAttsAppService.GetWithNavigationPropertiesAsync(Id);
            CustomerGroupByAtt = ObjectMapper.Map<CustomerGroupByAttDto, CustomerGroupByAttUpdateViewModel>(customerGroupByAttWithNavigationPropertiesDto.CustomerGroupByAtt);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _customerGroupByAttsAppService.UpdateAsync(Id, ObjectMapper.Map<CustomerGroupByAttUpdateViewModel, CustomerGroupByAttUpdateDto>(CustomerGroupByAtt));
            return NoContent();
        }
    }

    public class CustomerGroupByAttUpdateViewModel : CustomerGroupByAttUpdateDto
    {
    }
}