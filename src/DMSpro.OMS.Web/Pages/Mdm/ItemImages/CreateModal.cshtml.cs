using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.ItemImages;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemImages
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public ItemImageCreateViewModel ItemImage { get; set; }

        public List<SelectListItem> ItemMasterLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IItemImagesAppService _itemImagesAppService;

        public CreateModalModel(IItemImagesAppService itemImagesAppService)
        {
            _itemImagesAppService = itemImagesAppService;
        }

        public async Task OnGetAsync()
        {
            ItemImage = new ItemImageCreateViewModel();
            ItemMasterLookupListRequired.AddRange((
                                    await _itemImagesAppService.GetItemMasterLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _itemImagesAppService.CreateAsync(ObjectMapper.Map<ItemImageCreateViewModel, ItemImageCreateDto>(ItemImage));
            return NoContent();
        }
    }

    public class ItemImageCreateViewModel : ItemImageCreateDto
    {
    }
}
