using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.ProductAttributes;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.ProductAttributes
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
        [SelectItems(nameof(IsProductCategoryBoolFilterItems))]
        public string IsProductCategoryFilter { get; set; }

        public List<SelectListItem> IsProductCategoryBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };

        private readonly IProductAttributesAppService _productAttributesAppService;

        public IndexModel(IProductAttributesAppService productAttributesAppService)
        {
            _productAttributesAppService = productAttributesAppService;
        }

        public async Task OnGetAsync()
        {

            await Task.CompletedTask;
        }
    }
}
