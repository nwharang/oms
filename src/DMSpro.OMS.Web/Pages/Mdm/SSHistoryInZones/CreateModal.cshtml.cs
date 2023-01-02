using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.SSHistoryInZones;

namespace DMSpro.OMS.MdmService.Web.Pages.SSHistoryInZones
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public SSHistoryInZoneCreateViewModel SSHistoryInZone { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ISSHistoryInZonesAppService _sSHistoryInZonesAppService;

        public CreateModalModel(ISSHistoryInZonesAppService sSHistoryInZonesAppService)
        {
            _sSHistoryInZonesAppService = sSHistoryInZonesAppService;
        }

        public async Task OnGetAsync()
        {
            SSHistoryInZone = new SSHistoryInZoneCreateViewModel();
            SalesOrgHierarchyLookupListRequired.AddRange((
                                    await _sSHistoryInZonesAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            EmployeeProfileLookupListRequired.AddRange((
                                    await _sSHistoryInZonesAppService.GetEmployeeProfileLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _sSHistoryInZonesAppService.CreateAsync(ObjectMapper.Map<SSHistoryInZoneCreateViewModel, SSHistoryInZoneCreateDto>(SSHistoryInZone));
            return NoContent();
        }
    }

    public class SSHistoryInZoneCreateViewModel : SSHistoryInZoneCreateDto
    {
    }
}