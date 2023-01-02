using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.PriceUpdateDetails;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceUpdateDetails
{
    public class IndexModel : AbpPageModel
    {
        public int? PriceBeforeUpdateFilterMin { get; set; }

        public int? PriceBeforeUpdateFilterMax { get; set; }
        public int? NewPriceFilterMin { get; set; }

        public int? NewPriceFilterMax { get; set; }
        public DateTime? UpdatedDateFilterMin { get; set; }

        public DateTime? UpdatedDateFilterMax { get; set; }
        [SelectItems(nameof(PriceUpdateLookupList))]
        public Guid PriceUpdateIdFilter { get; set; }
        public List<SelectListItem> PriceUpdateLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(PriceListDetailLookupList))]
        public Guid PriceListDetailIdFilter { get; set; }
        public List<SelectListItem> PriceListDetailLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IPriceUpdateDetailsAppService _priceUpdateDetailsAppService;

        public IndexModel(IPriceUpdateDetailsAppService priceUpdateDetailsAppService)
        {
            _priceUpdateDetailsAppService = priceUpdateDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            PriceUpdateLookupList.AddRange((
                    await _priceUpdateDetailsAppService.GetPriceUpdateLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            PriceListDetailLookupList.AddRange((
                            await _priceUpdateDetailsAppService.GetPriceListDetailLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}
