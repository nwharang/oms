using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.PriceListDetails;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceListDetails
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public PriceListDetailCreateViewModel PriceListDetail { get; set; }

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

        public CreateModalModel(IPriceListDetailsAppService priceListDetailsAppService)
        {
            _priceListDetailsAppService = priceListDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            PriceListDetail = new PriceListDetailCreateViewModel();
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

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _priceListDetailsAppService.CreateAsync(ObjectMapper.Map<PriceListDetailCreateViewModel, PriceListDetailCreateDto>(PriceListDetail));
            return NoContent();
        }
    }

    public class PriceListDetailCreateViewModel : PriceListDetailCreateDto
    {
    }
}
