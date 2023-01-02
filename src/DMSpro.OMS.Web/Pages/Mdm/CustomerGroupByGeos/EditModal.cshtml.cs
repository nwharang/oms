using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.CustomerGroupByGeos;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroupByGeos
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CustomerGroupByGeoUpdateViewModel CustomerGroupByGeo { get; set; }

        public List<SelectListItem> CustomerGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> GeoMasterLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerGroupByGeosAppService _customerGroupByGeosAppService;

        public EditModalModel(ICustomerGroupByGeosAppService customerGroupByGeosAppService)
        {
            _customerGroupByGeosAppService = customerGroupByGeosAppService;
        }

        public async Task OnGetAsync()
        {
            var customerGroupByGeoWithNavigationPropertiesDto = await _customerGroupByGeosAppService.GetWithNavigationPropertiesAsync(Id);
            CustomerGroupByGeo = ObjectMapper.Map<CustomerGroupByGeoDto, CustomerGroupByGeoUpdateViewModel>(customerGroupByGeoWithNavigationPropertiesDto.CustomerGroupByGeo);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _customerGroupByGeosAppService.UpdateAsync(Id, ObjectMapper.Map<CustomerGroupByGeoUpdateViewModel, CustomerGroupByGeoUpdateDto>(CustomerGroupByGeo));
            return NoContent();
        }
    }

    public class CustomerGroupByGeoUpdateViewModel : CustomerGroupByGeoUpdateDto
    {
    }
}