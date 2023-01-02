using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.ItemImages;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemImages
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
        public int? DisplayOrderFilterMin { get; set; }

        public int? DisplayOrderFilterMax { get; set; }
        [SelectItems(nameof(ItemMasterLookupList))]
        public Guid ItemIdFilter { get; set; }
        public List<SelectListItem> ItemMasterLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IItemImagesAppService _itemImagesAppService;

        public IndexModel(IItemImagesAppService itemImagesAppService)
        {
            _itemImagesAppService = itemImagesAppService;
        }

        public async Task OnGetAsync()
        {
            ItemMasterLookupList.AddRange((
                    await _itemImagesAppService.GetItemMasterLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            await Task.CompletedTask;
        }
    }
}
