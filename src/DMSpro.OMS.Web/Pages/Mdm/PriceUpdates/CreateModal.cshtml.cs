using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.PriceUpdates;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceUpdates
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public PriceUpdateCreateViewModel PriceUpdate { get; set; }

        public List<SelectListItem> PriceListLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IPriceUpdatesAppService _priceUpdatesAppService;

        public CreateModalModel(IPriceUpdatesAppService priceUpdatesAppService)
        {
            _priceUpdatesAppService = priceUpdatesAppService;
        }

        public async Task OnGetAsync()
        {
            PriceUpdate = new PriceUpdateCreateViewModel();
            PriceListLookupListRequired.AddRange((
                                    await _priceUpdatesAppService.GetPriceListLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _priceUpdatesAppService.CreateAsync(ObjectMapper.Map<PriceUpdateCreateViewModel, PriceUpdateCreateDto>(PriceUpdate));
            return NoContent();
        }
    }

    public class PriceUpdateCreateViewModel : PriceUpdateCreateDto
    {
    }
}
