using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.PriceListDetails;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceListDetails
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public PriceListDetailUpdateViewModel PriceListDetail { get; set; }

        public List<SelectListItem> PriceListLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> ItemMasterLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> UOMLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IPriceListDetailsAppService _priceListDetailsAppService;

        public EditModalModel(IPriceListDetailsAppService priceListDetailsAppService)
        {
            _priceListDetailsAppService = priceListDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            var priceListDetailWithNavigationPropertiesDto = await _priceListDetailsAppService.GetWithNavigationPropertiesAsync(Id);
            PriceListDetail = ObjectMapper.Map<PriceListDetailDto, PriceListDetailUpdateViewModel>(priceListDetailWithNavigationPropertiesDto.PriceListDetail);

            PriceListLookupListRequired.AddRange((
                                    await _priceListDetailsAppService.GetPriceListLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            ItemMasterLookupListRequired.AddRange((
                                    await _priceListDetailsAppService.GetItemMasterLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            UOMLookupListRequired.AddRange((
                                    await _priceListDetailsAppService.GetUOMLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _priceListDetailsAppService.UpdateAsync(Id, ObjectMapper.Map<PriceListDetailUpdateViewModel, PriceListDetailUpdateDto>(PriceListDetail));
            return NoContent();
        }
    }

    public class PriceListDetailUpdateViewModel : PriceListDetailUpdateDto
    {
    }
}
