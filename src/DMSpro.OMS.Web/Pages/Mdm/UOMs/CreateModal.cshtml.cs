using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.UOMs;

namespace DMSpro.OMS.MdmService.Web.Pages.UOMs
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public UOMCreateViewModel UOM { get; set; }

        private readonly IUOMsAppService _uOMsAppService;

        public CreateModalModel(IUOMsAppService uOMsAppService)
        {
            _uOMsAppService = uOMsAppService;
        }

        public async Task OnGetAsync()
        {
            UOM = new UOMCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _uOMsAppService.CreateAsync(ObjectMapper.Map<UOMCreateViewModel, UOMCreateDto>(UOM));
            return NoContent();
        }
    }

    public class UOMCreateViewModel : UOMCreateDto
    {
    }
}