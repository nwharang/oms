using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.PriceLists;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceLists
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public PriceListUpdateViewModel PriceList { get; set; }

        public List<SelectListItem> PriceListLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly IPriceListsAppService _priceListsAppService;

        public EditModalModel(IPriceListsAppService priceListsAppService)
        {
            _priceListsAppService = priceListsAppService;
        }

        public async Task OnGetAsync()
        {
            var priceListWithNavigationPropertiesDto = await _priceListsAppService.GetWithNavigationPropertiesAsync(Id);
            PriceList = ObjectMapper.Map<PriceListDto, PriceListUpdateViewModel>(priceListWithNavigationPropertiesDto.PriceList);

            PriceListLookupList.AddRange((
                                    await _priceListsAppService.GetPriceListLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _priceListsAppService.UpdateAsync(Id, ObjectMapper.Map<PriceListUpdateViewModel, PriceListUpdateDto>(PriceList));
            return NoContent();
        }
    }

    public class PriceListUpdateViewModel : PriceListUpdateDto
    {
    }
}
