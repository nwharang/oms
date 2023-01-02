using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.GeoMasters;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.GeoMasters
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public string ERPCodeFilter { get; set; }
        public string NameFilter { get; set; }
        public int? LevelFilterMin { get; set; }

        public int? LevelFilterMax { get; set; }
        [SelectItems(nameof(GeoMasterLookupList))]
        public Guid? ParentIdFilter { get; set; }
        public List<SelectListItem> GeoMasterLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IGeoMastersAppService _geoMastersAppService;

        public IndexModel(IGeoMastersAppService geoMastersAppService)
        {
            _geoMastersAppService = geoMastersAppService;
        }

        public async Task OnGetAsync()
        {
            GeoMasterLookupList.AddRange((
                    await _geoMastersAppService.GetGeoMasterLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            await Task.CompletedTask;
        }
    }
}
