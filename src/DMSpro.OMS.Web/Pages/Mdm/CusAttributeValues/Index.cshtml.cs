using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.CusAttributeValues;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.CusAttributeValues
{
    public class IndexModel : AbpPageModel
    {
        public string AttrValNameFilter { get; set; }
        [SelectItems(nameof(CustomerAttributeLookupList))]
        public Guid CustomerAttributeIdFilter { get; set; }
        public List<SelectListItem> CustomerAttributeLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(CusAttributeValueLookupList))]
        public Guid? ParentCusAttributeValueIdFilter { get; set; }
        public List<SelectListItem> CusAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly ICusAttributeValuesAppService _cusAttributeValuesAppService;

        public IndexModel(ICusAttributeValuesAppService cusAttributeValuesAppService)
        {
            _cusAttributeValuesAppService = cusAttributeValuesAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerAttributeLookupList.AddRange((
                    await _cusAttributeValuesAppService.GetCustomerAttributeLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            CusAttributeValueLookupList.AddRange((
                            await _cusAttributeValuesAppService.GetCusAttributeValueLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}