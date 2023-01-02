using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.Currencies;

namespace DMSpro.OMS.MdmService.Web.Pages.Currencies
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CurrencyCreateViewModel Currency { get; set; }

        private readonly ICurrenciesAppService _currenciesAppService;

        public CreateModalModel(ICurrenciesAppService currenciesAppService)
        {
            _currenciesAppService = currenciesAppService;
        }

        public async Task OnGetAsync()
        {
            Currency = new CurrencyCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _currenciesAppService.CreateAsync(ObjectMapper.Map<CurrencyCreateViewModel, CurrencyCreateDto>(Currency));
            return NoContent();
        }
    }

    public class CurrencyCreateViewModel : CurrencyCreateDto
    {
    }
}