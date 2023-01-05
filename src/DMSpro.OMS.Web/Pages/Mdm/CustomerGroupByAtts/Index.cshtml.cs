using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.CustomerGroupByAtts;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerGroupByAtts
{
    public class IndexModel : AbpPageModel
    {
        public string CustomerGroupIdFilter { get; set; }
        public string AttributeCodeFilter { get; set; }
        public string ValueCodeFilter { get; set; }
        public string ValueNameFilter { get; set; }

        private readonly ICustomerGroupByAttsAppService _customerGroupByAttsAppService;

        public IndexModel(ICustomerGroupByAttsAppService customerGroupByAttsAppService)
        {
            _customerGroupByAttsAppService = customerGroupByAttsAppService;
        }

        public async Task OnGetAsync()
        {

            await Task.CompletedTask;
        }
    }
}