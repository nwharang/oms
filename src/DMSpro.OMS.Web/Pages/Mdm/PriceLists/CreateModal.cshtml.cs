using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.PriceLists;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceLists
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public PriceListCreateViewModel PriceList { get; set; }

        public List<SelectListItem> PriceListLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly IPriceListsAppService _priceListsAppService;

        public CreateModalModel(IPriceListsAppService priceListsAppService)
        {
            _priceListsAppService = priceListsAppService;
        }

        public async Task OnGetAsync()
        {
            PriceList = new PriceListCreateViewModel();
            PriceListLookupList.AddRange((
                                    await _priceListsAppService.GetPriceListLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _priceListsAppService.CreateAsync(ObjectMapper.Map<PriceListCreateViewModel, PriceListCreateDto>(PriceList));
            return NoContent();
        }
    }

    public class PriceListCreateViewModel : PriceListCreateDto
    {
    }
}
