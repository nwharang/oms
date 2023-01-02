using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.ItemGroupLists;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemGroupLists
{
    public class IndexModel : AbpPageModel
    {
        public int? RateFilterMin { get; set; }

        public int? RateFilterMax { get; set; }
        [SelectItems(nameof(ItemGroupLookupList))]
        public Guid ItemGroupIdFilter { get; set; }
        public List<SelectListItem> ItemGroupLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(ItemMasterLookupList))]
        public Guid ItemIdFilter { get; set; }
        public List<SelectListItem> ItemMasterLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(UOMLookupList))]
        public Guid UOMIdFilter { get; set; }
        public List<SelectListItem> UOMLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IItemGroupListsAppService _itemGroupListsAppService;

        public IndexModel(IItemGroupListsAppService itemGroupListsAppService)
        {
            _itemGroupListsAppService = itemGroupListsAppService;
        }

        public async Task OnGetAsync()
        {
            ItemGroupLookupList.AddRange((
                    await _itemGroupListsAppService.GetItemGroupLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            ItemMasterLookupList.AddRange((
                            await _itemGroupListsAppService.GetItemMasterLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            UOMLookupList.AddRange((
                            await _itemGroupListsAppService.GetUOMLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}
