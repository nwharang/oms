using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.SSHistoryInZones;

namespace DMSpro.OMS.MdmService.Web.Pages.SSHistoryInZones
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public SSHistoryInZoneUpdateViewModel SSHistoryInZone { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> EmployeeProfileLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ISSHistoryInZonesAppService _sSHistoryInZonesAppService;

        public EditModalModel(ISSHistoryInZonesAppService sSHistoryInZonesAppService)
        {
            _sSHistoryInZonesAppService = sSHistoryInZonesAppService;
        }

        public async Task OnGetAsync()
        {
            var sSHistoryInZoneWithNavigationPropertiesDto = await _sSHistoryInZonesAppService.GetWithNavigationPropertiesAsync(Id);
            SSHistoryInZone = ObjectMapper.Map<SSHistoryInZoneDto, SSHistoryInZoneUpdateViewModel>(sSHistoryInZoneWithNavigationPropertiesDto.SSHistoryInZone);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _sSHistoryInZonesAppService.UpdateAsync(Id, ObjectMapper.Map<SSHistoryInZoneUpdateViewModel, SSHistoryInZoneUpdateDto>(SSHistoryInZone));
            return NoContent();
        }
    }

    public class SSHistoryInZoneUpdateViewModel : SSHistoryInZoneUpdateDto
    {
    }
}