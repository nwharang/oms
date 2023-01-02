using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.ItemGroupLists;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemGroupLists
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public ItemGroupListCreateViewModel ItemGroupList { get; set; }

        public List<SelectListItem> ItemGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> ItemMasterLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> UOMLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IItemGroupListsAppService _itemGroupListsAppService;

        public CreateModalModel(IItemGroupListsAppService itemGroupListsAppService)
        {
            _itemGroupListsAppService = itemGroupListsAppService;
        }

        public async Task OnGetAsync()
        {
            ItemGroupList = new ItemGroupListCreateViewModel();
            ItemGroupLookupListRequired.AddRange((
                                    await _itemGroupListsAppService.GetItemGroupLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            ItemMasterLookupListRequired.AddRange((
                                    await _itemGroupListsAppService.GetItemMasterLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            UOMLookupListRequired.AddRange((
                                    await _itemGroupListsAppService.GetUOMLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _itemGroupListsAppService.CreateAsync(ObjectMapper.Map<ItemGroupListCreateViewModel, ItemGroupListCreateDto>(ItemGroupList));
            return NoContent();
        }
    }

    public class ItemGroupListCreateViewModel : ItemGroupListCreateDto
    {
    }
}
