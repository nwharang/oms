using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.SystemDatas;

namespace DMSpro.OMS.MdmService.Web.Pages.SystemDatas
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public SystemDataUpdateViewModel SystemData { get; set; }

        private readonly ISystemDatasAppService _systemDatasAppService;

        public EditModalModel(ISystemDatasAppService systemDatasAppService)
        {
            _systemDatasAppService = systemDatasAppService;
        }

        public async Task OnGetAsync()
        {
            var systemData = await _systemDatasAppService.GetAsync(Id);
            SystemData = ObjectMapper.Map<SystemDataDto, SystemDataUpdateViewModel>(systemData);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _systemDatasAppService.UpdateAsync(Id, ObjectMapper.Map<SystemDataUpdateViewModel, SystemDataUpdateDto>(SystemData));
            return NoContent();
        }
    }

    public class SystemDataUpdateViewModel : SystemDataUpdateDto
    {
    }
}