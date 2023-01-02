using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.Companies;

namespace DMSpro.OMS.MdmService.Web.Pages.Companies
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CompanyUpdateViewModel Company { get; set; }

        public List<SelectListItem> CompanyLookupList { get; set; }
        public List<SelectListItem> GeoMasterLookupList { get; set; }

        private readonly ICompaniesAppService _companiesAppService;

        public EditModalModel(ICompaniesAppService companiesAppService)
        {
            _companiesAppService = companiesAppService;
        }

        public async Task OnGetAsync()
        {
            var companyWithNavigationPropertiesDto = await _companiesAppService.GetWithNavigationPropertiesAsync(Id);
            Company = ObjectMapper.Map<CompanyDto, CompanyUpdateViewModel>(companyWithNavigationPropertiesDto.Company);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _companiesAppService.UpdateAsync(Id, ObjectMapper.Map<CompanyUpdateViewModel, CompanyUpdateDto>(Company));
            return NoContent();
        }
    }

    public class CompanyUpdateViewModel : CompanyUpdateDto
    {
    }
}
