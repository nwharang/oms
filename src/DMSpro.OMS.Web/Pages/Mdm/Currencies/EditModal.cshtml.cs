using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.Currencies;

namespace DMSpro.OMS.MdmService.Web.Pages.Currencies
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CurrencyUpdateViewModel Currency { get; set; }

        private readonly ICurrenciesAppService _currenciesAppService;

        public EditModalModel(ICurrenciesAppService currenciesAppService)
        {
            _currenciesAppService = currenciesAppService;
        }

        public async Task OnGetAsync()
        {
            var currency = await _currenciesAppService.GetAsync(Id);
            Currency = ObjectMapper.Map<CurrencyDto, CurrencyUpdateViewModel>(currency);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _currenciesAppService.UpdateAsync(Id, ObjectMapper.Map<CurrencyUpdateViewModel, CurrencyUpdateDto>(Currency));
            return NoContent();
        }
    }

    public class CurrencyUpdateViewModel : CurrencyUpdateDto
    {
    }
}