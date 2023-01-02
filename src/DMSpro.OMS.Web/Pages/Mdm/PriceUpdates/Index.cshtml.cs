using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.PriceUpdates;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceUpdates
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public string DescriptionFilter { get; set; }
        public DateTime? EffectiveDateFilterMin { get; set; }

        public DateTime? EffectiveDateFilterMax { get; set; }
        public PriceUpdateStatus? StatusFilter { get; set; }
        public DateTime? UpdateStatusDateFilterMin { get; set; }

        public DateTime? UpdateStatusDateFilterMax { get; set; }
        [SelectItems(nameof(PriceListLookupList))]
        public Guid PriceListIdFilter { get; set; }
        public List<SelectListItem> PriceListLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IPriceUpdatesAppService _priceUpdatesAppService;

        public IndexModel(IPriceUpdatesAppService priceUpdatesAppService)
        {
            _priceUpdatesAppService = priceUpdatesAppService;
        }

        public async Task OnGetAsync()
        {
            PriceListLookupList.AddRange((
                    await _priceUpdatesAppService.GetPriceListLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            await Task.CompletedTask;
        }
    }
}
