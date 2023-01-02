using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.GeoMasters;

namespace DMSpro.OMS.MdmService.Web.Pages.GeoMasters
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public GeoMasterCreateViewModel GeoMaster { get; set; }

        public List<SelectListItem> GeoMasterLookupList { get; set; }

        private readonly IGeoMastersAppService _geoMastersAppService;

        public CreateModalModel(IGeoMastersAppService geoMastersAppService)
        {
            _geoMastersAppService = geoMastersAppService;
        }

        public async Task OnGetAsync()
        {
            GeoMaster = new GeoMasterCreateViewModel();
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

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _geoMastersAppService.CreateAsync(ObjectMapper.Map<GeoMasterCreateViewModel, GeoMasterCreateDto>(GeoMaster));
            return NoContent();
        }
    }

    public class GeoMasterCreateViewModel : GeoMasterCreateDto
    {
    }
}
