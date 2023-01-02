using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CustomerGroupByGeos;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroupByGeos
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CustomerGroupByGeoCreateViewModel CustomerGroupByGeo { get; set; }

        public List<SelectListItem> CustomerGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> GeoMasterLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerGroupByGeosAppService _customerGroupByGeosAppService;

        public CreateModalModel(ICustomerGroupByGeosAppService customerGroupByGeosAppService)
        {
            _customerGroupByGeosAppService = customerGroupByGeosAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerGroupByGeo = new CustomerGroupByGeoCreateViewModel();
            CustomerGroupLookupListRequired.AddRange((
                                    await _customerGroupByGeosAppService.GetCustomerGroupLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            GeoMasterLookupListRequired.AddRange((
                                    await _customerGroupByGeosAppService.GetGeoMasterLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _customerGroupByGeosAppService.CreateAsync(ObjectMapper.Map<CustomerGroupByGeoCreateViewModel, CustomerGroupByGeoCreateDto>(CustomerGroupByGeo));
            return NoContent();
        }
    }

    public class CustomerGroupByGeoCreateViewModel : CustomerGroupByGeoCreateDto
    {
    }
}