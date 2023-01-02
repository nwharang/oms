using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.Streets;

namespace DMSpro.OMS.MdmService.Web.Pages.Streets
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public StreetCreateViewModel Street { get; set; }

        private readonly IStreetsAppService _streetsAppService;

        public CreateModalModel(IStreetsAppService streetsAppService)
        {
            _streetsAppService = streetsAppService;
        }

        public async Task OnGetAsync()
        {
            Street = new StreetCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _streetsAppService.CreateAsync(ObjectMapper.Map<StreetCreateViewModel, StreetCreateDto>(Street));
            return NoContent();
        }
    }

    public class StreetCreateViewModel : StreetCreateDto
    {
    }
}