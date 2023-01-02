using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.Vendors;

namespace DMSpro.OMS.MdmService.Web.Pages.Vendors
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public VendorUpdateViewModel Vendor { get; set; }

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

        public EditModalModel(IVendorsAppService vendorsAppService)
        {
            _vendorsAppService = vendorsAppService;
        }

        public async Task OnGetAsync()
        {
            var vendorWithNavigationPropertiesDto = await _vendorsAppService.GetWithNavigationPropertiesAsync(Id);
            Vendor = ObjectMapper.Map<VendorDto, VendorUpdateViewModel>(vendorWithNavigationPropertiesDto.Vendor);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _vendorsAppService.UpdateAsync(Id, ObjectMapper.Map<VendorUpdateViewModel, VendorUpdateDto>(Vendor));
            return NoContent();
        }
    }

    public class VendorUpdateViewModel : VendorUpdateDto
    {
    }
}