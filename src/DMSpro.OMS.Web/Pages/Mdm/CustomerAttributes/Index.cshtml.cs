using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.CustomerAttributes;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerAttributes
{
    public class IndexModel : AbpPageModel
    {
        public int? AttrNoFilterMin { get; set; }

        public int? AttrNoFilterMax { get; set; }
        public string AttrNameFilter { get; set; }
        public int? HierarchyLevelFilterMin { get; set; }

        public int? HierarchyLevelFilterMax { get; set; }
        [SelectItems(nameof(ActiveBoolFilterItems))]
        public string ActiveFilter { get; set; }

        public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };

        private readonly ICustomerAttributesAppService _customerAttributesAppService;

        public IndexModel(ICustomerAttributesAppService customerAttributesAppService)
        {
            _customerAttributesAppService = customerAttributesAppService;
        }

        public async Task OnGetAsync()
        {

            await Task.CompletedTask;
        }
    }
}