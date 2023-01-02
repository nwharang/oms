using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.GeoMasters;

namespace DMSpro.OMS.MdmService.Web.Pages.GeoMasters
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public GeoMasterUpdateViewModel GeoMaster { get; set; }

        public List<SelectListItem> GeoMasterLookupList { get; set; }

        private readonly IGeoMastersAppService _geoMastersAppService;

        public EditModalModel(IGeoMastersAppService geoMastersAppService)
        {
            _geoMastersAppService = geoMastersAppService;
        }

        public async Task OnGetAsync()
        {
            var geoMasterWithNavigationPropertiesDto = await _geoMastersAppService.GetWithNavigationPropertiesAsync(Id);
            GeoMaster = ObjectMapper.Map<GeoMasterDto, GeoMasterUpdateViewModel>(geoMasterWithNavigationPropertiesDto.GeoMaster);

            GeoMasterLookupList = new List<SelectListItem>
            {
                new SelectListItem(L["SelectParentNotRequired"], "")
            };
            GeoMasterLookupList.AddRange((
                                    await _geoMastersAppService.GetGeoMasterLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _geoMastersAppService.UpdateAsync(Id, ObjectMapper.Map<GeoMasterUpdateViewModel, GeoMasterUpdateDto>(GeoMaster));
            return NoContent();
        }
    }

    public class GeoMasterUpdateViewModel : GeoMasterUpdateDto
    {
    }
}
