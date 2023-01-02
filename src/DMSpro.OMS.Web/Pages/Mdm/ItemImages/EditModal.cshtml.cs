using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.ItemImages;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemImages
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public ItemImageUpdateViewModel ItemImage { get; set; }

        public List<SelectListItem> ItemMasterLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IItemImagesAppService _itemImagesAppService;

        public EditModalModel(IItemImagesAppService itemImagesAppService)
        {
            _itemImagesAppService = itemImagesAppService;
        }

        public async Task OnGetAsync()
        {
            var itemImageWithNavigationPropertiesDto = await _itemImagesAppService.GetWithNavigationPropertiesAsync(Id);
            ItemImage = ObjectMapper.Map<ItemImageDto, ItemImageUpdateViewModel>(itemImageWithNavigationPropertiesDto.ItemImage);

            ItemMasterLookupListRequired.AddRange((
                                    await _itemImagesAppService.GetItemMasterLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _itemImagesAppService.UpdateAsync(Id, ObjectMapper.Map<ItemImageUpdateViewModel, ItemImageUpdateDto>(ItemImage));
            return NoContent();
        }
    }

    public class ItemImageUpdateViewModel : ItemImageUpdateDto
    {
    }
}
