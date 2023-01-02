using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.VATs;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.VATs
{
    public class IndexModel : AbpPageModel
    {
        public string NameFilter { get; set; }
        public uint? RateFilterMin { get; set; }

        public uint? RateFilterMax { get; set; }

        private readonly IVATsAppService _vATsAppService;

        public IndexModel(IVATsAppService vATsAppService)
        {
            _vATsAppService = vATsAppService;
        }

        public async Task OnGetAsync()
        {

            await Task.CompletedTask;
        }
    }
}