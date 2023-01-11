using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.CustomerGroups;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroups
{
    public class IndexModel : AbpPageModel
    {
        // public string CodeFilter { get; set; }
        // public string NameFilter { get; set; }
        // [SelectItems(nameof(ActiveBoolFilterItems))]
        // public string ActiveFilter { get; set; }

        // public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
        //     new List<SelectListItem>
        //     {
        //         new SelectListItem("", ""),
        //         new SelectListItem("Yes", "true"),
        //         new SelectListItem("No", "false"),
        //     };
        // public DateTime? EffDateFilterMin { get; set; }

        // public DateTime? EffDateFilterMax { get; set; }
        // public short? GroupByModeFilterMin { get; set; }

        // public short? GroupByModeFilterMax { get; set; }
        // public short? CustomerTypeFilterMin { get; set; }

        // public short? CustomerTypeFilterMax { get; set; }

        // private readonly ICustomerGroupsAppService _customerGroupsAppService;

        // public IndexModel(ICustomerGroupsAppService customerGroupsAppService)
        // {
        //     _customerGroupsAppService = customerGroupsAppService;
        // }

        // public async Task OnGetAsync()
        // {

        //     await Task.CompletedTask;
        // }
    }
}