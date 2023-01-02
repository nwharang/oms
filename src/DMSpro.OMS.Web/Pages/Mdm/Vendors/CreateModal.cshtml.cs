using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.Vendors;

namespace DMSpro.OMS.MdmService.Web.Pages.Vendors
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public VendorCreateViewModel Vendor { get; set; }

        public List<SelectListItem> CompanyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> PriceListLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> GeoMasterLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly IVendorsAppService _vendorsAppService;

        public CreateModalModel(IVendorsAppService vendorsAppService)
        {
            _vendorsAppService = vendorsAppService;
        }

        public async Task OnGetAsync()
        {
            Vendor = new VendorCreateViewModel();
            CompanyLookupListRequired.AddRange((
                                    await _vendorsAppService.GetCompanyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            PriceListLookupListRequired.AddRange((
                                    await _vendorsAppService.GetPriceListLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            GeoMasterLookupList.AddRange((
                                    await _vendorsAppService.GetGeoMasterLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _vendorsAppService.CreateAsync(ObjectMapper.Map<VendorCreateViewModel, VendorCreateDto>(Vendor));
            return NoContent();
        }
    }

    public class VendorCreateViewModel : VendorCreateDto
    {
    }
}