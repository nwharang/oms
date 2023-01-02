using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CompanyInZones;

namespace DMSpro.OMS.MdmService.Web.Pages.CompanyInZones
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CompanyInZoneCreateViewModel CompanyInZone { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CompanyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICompanyInZonesAppService _companyInZonesAppService;

        public CreateModalModel(ICompanyInZonesAppService companyInZonesAppService)
        {
            _companyInZonesAppService = companyInZonesAppService;
        }

        public async Task OnGetAsync()
        {
            CompanyInZone = new CompanyInZoneCreateViewModel();
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

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _companyInZonesAppService.CreateAsync(ObjectMapper.Map<CompanyInZoneCreateViewModel, CompanyInZoneCreateDto>(CompanyInZone));
            return NoContent();
        }
    }

    public class CompanyInZoneCreateViewModel : CompanyInZoneCreateDto
    {
    }
}