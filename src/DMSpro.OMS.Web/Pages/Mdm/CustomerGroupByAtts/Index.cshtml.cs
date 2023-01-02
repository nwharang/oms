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
        public string ValueCodeFilter { get; set; }
        public string ValueNameFilter { get; set; }
        [SelectItems(nameof(CustomerGroupLookupList))]
        public Guid CustomerGroupIdFilter { get; set; }
        public List<SelectListItem> CustomerGroupLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid CusAttributeValueIdFilter { get; set; }
        public List<SelectListItem> CusAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly ICustomerGroupByAttsAppService _customerGroupByAttsAppService;

        public IndexModel(ICustomerGroupByAttsAppService customerGroupByAttsAppService)
        {
            _customerGroupByAttsAppService = customerGroupByAttsAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerGroupLookupList.AddRange((
                    await _customerGroupByAttsAppService.GetCustomerGroupLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            CusAttributeValueLookupList.AddRange((
                            await _customerGroupByAttsAppService.GetCusAttributeValueLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}