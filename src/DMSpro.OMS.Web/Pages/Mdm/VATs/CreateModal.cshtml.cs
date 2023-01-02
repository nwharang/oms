using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.VATs;

namespace DMSpro.OMS.MdmService.Web.Pages.VATs
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public VATCreateViewModel VAT { get; set; }

        private readonly IVATsAppService _vATsAppService;

        public CreateModalModel(IVATsAppService vATsAppService)
        {
            _vATsAppService = vATsAppService;
        }

        public async Task OnGetAsync()
        {
            VAT = new VATCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _vATsAppService.CreateAsync(ObjectMapper.Map<VATCreateViewModel, VATCreateDto>(VAT));
            return NoContent();
        }
    }

    public class VATCreateViewModel : VATCreateDto
    {
    }
}