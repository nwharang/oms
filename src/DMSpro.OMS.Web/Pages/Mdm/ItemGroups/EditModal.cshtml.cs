using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.ItemGroups;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemGroups
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public ItemGroupUpdateViewModel ItemGroup { get; set; }

        private readonly IItemGroupsAppService _itemGroupsAppService;

        public EditModalModel(IItemGroupsAppService itemGroupsAppService)
        {
            _itemGroupsAppService = itemGroupsAppService;
        }

        public async Task OnGetAsync()
        {
            var itemGroup = await _itemGroupsAppService.GetAsync(Id);
            ItemGroup = ObjectMapper.Map<ItemGroupDto, ItemGroupUpdateViewModel>(itemGroup);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _itemGroupsAppService.UpdateAsync(Id, ObjectMapper.Map<ItemGroupUpdateViewModel, ItemGroupUpdateDto>(ItemGroup));
            return NoContent();
        }
    }

    public class ItemGroupUpdateViewModel : ItemGroupUpdateDto
    {
    }
}