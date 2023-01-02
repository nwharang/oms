using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.VATs;

namespace DMSpro.OMS.MdmService.Web.Pages.VATs
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public VATUpdateViewModel VAT { get; set; }

        private readonly IVATsAppService _vATsAppService;

        public EditModalModel(IVATsAppService vATsAppService)
        {
            _vATsAppService = vATsAppService;
        }

        public async Task OnGetAsync()
        {
            var vAT = await _vATsAppService.GetAsync(Id);
            VAT = ObjectMapper.Map<VATDto, VATUpdateViewModel>(vAT);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _vATsAppService.UpdateAsync(Id, ObjectMapper.Map<VATUpdateViewModel, VATUpdateDto>(VAT));
            return NoContent();
        }
    }

    public class VATUpdateViewModel : VATUpdateDto
    {
    }
}