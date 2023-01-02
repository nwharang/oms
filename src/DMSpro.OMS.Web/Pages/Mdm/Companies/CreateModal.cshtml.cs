using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.Companies;

namespace DMSpro.OMS.MdmService.Web.Pages.Companies
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CompanyCreateViewModel Company { get; set; }

        public List<SelectListItem> CompanyLookupList { get; set; }
        public List<SelectListItem> GeoMasterLookupList { get; set; }

        private readonly ICompaniesAppService _companiesAppService;

        public CreateModalModel(ICompaniesAppService companiesAppService)
        {
            _companiesAppService = companiesAppService;
        }

        public async Task OnGetAsync()
        {
            Company = new CompanyCreateViewModel();
            CompanyLookupList = new List<SelectListItem>
            {
                new SelectListItem(L["SelectParentNotRequired"], "")
            };
            CompanyLookupList.AddRange((
                                    await _companiesAppService.GetCompanyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            GeoMasterLookupList = new List<SelectListItem>
            {
                new SelectListItem(L["SelectParentNotRequired"], "")
            };
            GeoMasterLookupList.AddRange((
                                    await _companiesAppService.GetGeoMasterLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _companiesAppService.CreateAsync(ObjectMapper.Map<CompanyCreateViewModel, CompanyCreateDto>(Company));
            return NoContent();
        }
    }

    public class CompanyCreateViewModel : CompanyCreateDto
    {
    }
}
