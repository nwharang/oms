using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.PriceListDetails;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceListDetails
{
    public class IndexModel : AbpPageModel
    {
        public int? PriceFilterMin { get; set; }

        public int? PriceFilterMax { get; set; }
        public int? BasedOnPriceFilterMin { get; set; }

        public int? BasedOnPriceFilterMax { get; set; }
        public string DescriptionFilter { get; set; }
        [SelectItems(nameof(PriceListLookupList))]
        public Guid PriceListIdFilter { get; set; }
        public List<SelectListItem> PriceListLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(ItemMasterLookupList))]
        public Guid ItemMasterIdFilter { get; set; }
        public List<SelectListItem> ItemMasterLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(UOMLookupList))]
        public Guid UOMIdFilter { get; set; }
        public List<SelectListItem> UOMLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IPriceListDetailsAppService _priceListDetailsAppService;

        public IndexModel(IPriceListDetailsAppService priceListDetailsAppService)
        {
            _priceListDetailsAppService = priceListDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            PriceListLookupList.AddRange((
                    await _priceListDetailsAppService.GetPriceListLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            ItemMasterLookupList.AddRange((
                            await _priceListDetailsAppService.GetItemMasterLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            UOMLookupList.AddRange((
                            await _priceListDetailsAppService.GetUOMLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}
