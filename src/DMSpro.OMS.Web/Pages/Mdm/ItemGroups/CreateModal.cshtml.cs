using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.ItemGroups;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemGroups
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public ItemGroupCreateViewModel ItemGroup { get; set; }

        private readonly IItemGroupsAppService _itemGroupsAppService;

        public CreateModalModel(IItemGroupsAppService itemGroupsAppService)
        {
            _itemGroupsAppService = itemGroupsAppService;
        }

        public async Task OnGetAsync()
        {
            ItemGroup = new ItemGroupCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _itemGroupsAppService.CreateAsync(ObjectMapper.Map<ItemGroupCreateViewModel, ItemGroupCreateDto>(ItemGroup));
            return NoContent();
        }
    }

    public class ItemGroupCreateViewModel : ItemGroupCreateDto
    {
    }
}