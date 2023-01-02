using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.SystemDatas;

namespace DMSpro.OMS.MdmService.Web.Pages.SystemDatas
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public SystemDataCreateViewModel SystemData { get; set; }

        private readonly ISystemDatasAppService _systemDatasAppService;

        public CreateModalModel(ISystemDatasAppService systemDatasAppService)
        {
            _systemDatasAppService = systemDatasAppService;
        }

        public async Task OnGetAsync()
        {
            SystemData = new SystemDataCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _systemDatasAppService.CreateAsync(ObjectMapper.Map<SystemDataCreateViewModel, SystemDataCreateDto>(SystemData));
            return NoContent();
        }
    }

    public class SystemDataCreateViewModel : SystemDataCreateDto
    {
    }
}