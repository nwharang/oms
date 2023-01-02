using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.ItemAttachments;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemAttachments
{
    public class IndexModel : AbpPageModel
    {
        public string DescriptionFilter { get; set; }
        [SelectItems(nameof(ActiveBoolFilterItems))]
        public string ActiveFilter { get; set; }

        public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        public string URLFilter { get; set; }
        [SelectItems(nameof(ItemMasterLookupList))]
        public Guid ItemIdFilter { get; set; }
        public List<SelectListItem> ItemMasterLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IItemAttachmentsAppService _itemAttachmentsAppService;

        public IndexModel(IItemAttachmentsAppService itemAttachmentsAppService)
        {
            _itemAttachmentsAppService = itemAttachmentsAppService;
        }

        public async Task OnGetAsync()
        {
            ItemMasterLookupList.AddRange((
                    await _itemAttachmentsAppService.GetItemMasterLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            await Task.CompletedTask;
        }
    }
}
