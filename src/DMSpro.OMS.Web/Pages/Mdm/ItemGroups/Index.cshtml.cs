using DMSpro.OMS.MdmService.ItemMasters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.ItemGroups;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemGroups
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public string NameFilter { get; set; }
        public string DescriptionFilter { get; set; }
        public GroupType? TypeFilter { get; set; }
        public Status? StatusFilter { get; set; }

        private readonly IItemGroupsAppService _itemGroupsAppService;

        public IndexModel(IItemGroupsAppService itemGroupsAppService)
        {
            _itemGroupsAppService = itemGroupsAppService;
        }

        public async Task OnGetAsync()
        {

            await Task.CompletedTask;
        }
    }
}
