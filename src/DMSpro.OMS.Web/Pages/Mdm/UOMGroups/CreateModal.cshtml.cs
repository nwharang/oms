using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.UOMGroups;

namespace DMSpro.OMS.MdmService.Web.Pages.UOMGroups
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public UOMGroupCreateViewModel UOMGroup { get; set; }

        private readonly IUOMGroupsAppService _uOMGroupsAppService;

        public CreateModalModel(IUOMGroupsAppService uOMGroupsAppService)
        {
            _uOMGroupsAppService = uOMGroupsAppService;
        }

        public async Task OnGetAsync()
        {
            UOMGroup = new UOMGroupCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _uOMGroupsAppService.CreateAsync(ObjectMapper.Map<UOMGroupCreateViewModel, UOMGroupCreateDto>(UOMGroup));
            return NoContent();
        }
    }

    public class UOMGroupCreateViewModel : UOMGroupCreateDto
    {
    }
}