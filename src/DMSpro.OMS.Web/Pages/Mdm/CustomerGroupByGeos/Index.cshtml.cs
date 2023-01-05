using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.CustomerGroupByGeos;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroupByGeos
{
    public class IndexModel : AbpPageModel
    {
        public string CustomerGroupIdFilter { get; set; }
        public short? GeoTypeFilterMin { get; set; }

        public short? GeoTypeFilterMax { get; set; }
        public string ValueFilter { get; set; }
        [SelectItems(nameof(ActiveBoolFilterItems))]
        public string ActiveFilter { get; set; }

        public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        public DateTime? EffDateFilterMin { get; set; }

        public DateTime? EffDateFilterMax { get; set; }

        private readonly ICustomerGroupByGeosAppService _customerGroupByGeosAppService;

        public IndexModel(ICustomerGroupByGeosAppService customerGroupByGeosAppService)
        {
            _customerGroupByGeosAppService = customerGroupByGeosAppService;
        }

        public async Task OnGetAsync()
        {

            await Task.CompletedTask;
        }
    }
}