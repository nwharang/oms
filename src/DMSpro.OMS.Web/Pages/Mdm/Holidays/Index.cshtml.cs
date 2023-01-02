using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.Holidays;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.Holidays
{
    public class IndexModel : AbpPageModel
    {
        public int? YearFilterMin { get; set; }

        public int? YearFilterMax { get; set; }
        public string DescriptionFilter { get; set; }

        private readonly IHolidaysAppService _holidaysAppService;

        public IndexModel(IHolidaysAppService holidaysAppService)
        {
            _holidaysAppService = holidaysAppService;
        }

        public async Task OnGetAsync()
        {

            await Task.CompletedTask;
        }
    }
}