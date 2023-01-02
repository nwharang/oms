using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.CompanyInZones;

namespace DMSpro.OMS.MdmService.Web.Pages.CompanyInZones
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CompanyInZoneUpdateViewModel CompanyInZone { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CompanyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICompanyInZonesAppService _companyInZonesAppService;

        public EditModalModel(ICompanyInZonesAppService companyInZonesAppService)
        {
            _companyInZonesAppService = companyInZonesAppService;
        }

        public async Task OnGetAsync()
        {
            var companyInZoneWithNavigationPropertiesDto = await _companyInZonesAppService.GetWithNavigationPropertiesAsync(Id);
            CompanyInZone = ObjectMapper.Map<CompanyInZoneDto, CompanyInZoneUpdateViewModel>(companyInZoneWithNavigationPropertiesDto.CompanyInZone);

            SalesOrgHierarchyLookupListRequired.AddRange((
                                    await _companyInZonesAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            CompanyLookupListRequired.AddRange((
                                    await _companyInZonesAppService.GetCompanyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _companyInZonesAppService.UpdateAsync(Id, ObjectMapper.Map<CompanyInZoneUpdateViewModel, CompanyInZoneUpdateDto>(CompanyInZone));
            return NoContent();
        }
    }

    public class CompanyInZoneUpdateViewModel : CompanyInZoneUpdateDto
    {
    }
}