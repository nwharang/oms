using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.ItemGroupLists;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemGroupLists
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public ItemGroupListUpdateViewModel ItemGroupList { get; set; }

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

        public EditModalModel(IItemGroupListsAppService itemGroupListsAppService)
        {
            _itemGroupListsAppService = itemGroupListsAppService;
        }

        public async Task OnGetAsync()
        {
            var itemGroupListWithNavigationPropertiesDto = await _itemGroupListsAppService.GetWithNavigationPropertiesAsync(Id);
            ItemGroupList = ObjectMapper.Map<ItemGroupListDto, ItemGroupListUpdateViewModel>(itemGroupListWithNavigationPropertiesDto.ItemGroupList);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _itemGroupListsAppService.UpdateAsync(Id, ObjectMapper.Map<ItemGroupListUpdateViewModel, ItemGroupListUpdateDto>(ItemGroupList));
            return NoContent();
        }
    }

    public class ItemGroupListUpdateViewModel : ItemGroupListUpdateDto
    {
    }
}
