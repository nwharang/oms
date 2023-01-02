using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.PriceUpdateDetails;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceUpdateDetails
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public PriceUpdateDetailCreateViewModel PriceUpdateDetail { get; set; }

        public List<SelectListItem> PriceUpdateLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> PriceListDetailLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IPriceUpdateDetailsAppService _priceUpdateDetailsAppService;

        public CreateModalModel(IPriceUpdateDetailsAppService priceUpdateDetailsAppService)
        {
            _priceUpdateDetailsAppService = priceUpdateDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            PriceUpdateDetail = new PriceUpdateDetailCreateViewModel();
            PriceUpdateLookupListRequired.AddRange((
                                    await _priceUpdateDetailsAppService.GetPriceUpdateLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            PriceListDetailLookupListRequired.AddRange((
                                    await _priceUpdateDetailsAppService.GetPriceListDetailLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _priceUpdateDetailsAppService.CreateAsync(ObjectMapper.Map<PriceUpdateDetailCreateViewModel, PriceUpdateDetailCreateDto>(PriceUpdateDetail));
            return NoContent();
        }
    }

    public class PriceUpdateDetailCreateViewModel : PriceUpdateDetailCreateDto
    {
    }
}
