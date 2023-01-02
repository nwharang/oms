using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.PriceUpdateDetails;

namespace DMSpro.OMS.MdmService.Web.Pages.PriceUpdateDetails
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public PriceUpdateDetailUpdateViewModel PriceUpdateDetail { get; set; }

        public List<SelectListItem> PriceUpdateLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> PriceListDetailLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IPriceUpdateDetailsAppService _priceUpdateDetailsAppService;

        public EditModalModel(IPriceUpdateDetailsAppService priceUpdateDetailsAppService)
        {
            _priceUpdateDetailsAppService = priceUpdateDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            var priceUpdateDetailWithNavigationPropertiesDto = await _priceUpdateDetailsAppService.GetWithNavigationPropertiesAsync(Id);
            PriceUpdateDetail = ObjectMapper.Map<PriceUpdateDetailDto, PriceUpdateDetailUpdateViewModel>(priceUpdateDetailWithNavigationPropertiesDto.PriceUpdateDetail);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _priceUpdateDetailsAppService.UpdateAsync(Id, ObjectMapper.Map<PriceUpdateDetailUpdateViewModel, PriceUpdateDetailUpdateDto>(PriceUpdateDetail));
            return NoContent();
        }
    }

    public class PriceUpdateDetailUpdateViewModel : PriceUpdateDetailUpdateDto
    {
    }
}
