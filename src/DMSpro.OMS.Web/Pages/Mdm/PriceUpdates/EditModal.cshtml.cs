using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.PriceUpdates;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceUpdates
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public PriceUpdateUpdateViewModel PriceUpdate { get; set; }

        public List<SelectListItem> PriceListLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IPriceUpdatesAppService _priceUpdatesAppService;

        public EditModalModel(IPriceUpdatesAppService priceUpdatesAppService)
        {
            _priceUpdatesAppService = priceUpdatesAppService;
        }

        public async Task OnGetAsync()
        {
            var priceUpdateWithNavigationPropertiesDto = await _priceUpdatesAppService.GetWithNavigationPropertiesAsync(Id);
            PriceUpdate = ObjectMapper.Map<PriceUpdateDto, PriceUpdateUpdateViewModel>(priceUpdateWithNavigationPropertiesDto.PriceUpdate);

            PriceListLookupListRequired.AddRange((
                                    await _priceUpdatesAppService.GetPriceListLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _priceUpdatesAppService.UpdateAsync(Id, ObjectMapper.Map<PriceUpdateUpdateViewModel, PriceUpdateUpdateDto>(PriceUpdate));
            return NoContent();
        }
    }

    public class PriceUpdateUpdateViewModel : PriceUpdateUpdateDto
    {
    }
}
