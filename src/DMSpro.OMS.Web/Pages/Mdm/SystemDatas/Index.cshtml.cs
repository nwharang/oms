using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.SystemDatas;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.SystemDatas
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public string ValueCodeFilter { get; set; }
        public string ValueNameFilter { get; set; }

        private readonly ISystemDatasAppService _systemDatasAppService;

        public IndexModel(ISystemDatasAppService systemDatasAppService)
        {
            _systemDatasAppService = systemDatasAppService;
        }

        public async Task OnGetAsync()
        {

            await Task.CompletedTask;
        }
    }
}