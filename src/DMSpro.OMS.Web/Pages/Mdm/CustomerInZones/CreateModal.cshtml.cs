using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CustomerInZones;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerInZones
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CustomerInZoneCreateViewModel CustomerInZone { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerInZonesAppService _customerInZonesAppService;

        public CreateModalModel(ICustomerInZonesAppService customerInZonesAppService)
        {
            _customerInZonesAppService = customerInZonesAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerInZone = new CustomerInZoneCreateViewModel();
            SalesOrgHierarchyLookupListRequired.AddRange((
                                    await _customerInZonesAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            CustomerLookupListRequired.AddRange((
                                    await _customerInZonesAppService.GetCustomerLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _customerInZonesAppService.CreateAsync(ObjectMapper.Map<CustomerInZoneCreateViewModel, CustomerInZoneCreateDto>(CustomerInZone));
            return NoContent();
        }
    }

    public class CustomerInZoneCreateViewModel : CustomerInZoneCreateDto
    {
    }
}