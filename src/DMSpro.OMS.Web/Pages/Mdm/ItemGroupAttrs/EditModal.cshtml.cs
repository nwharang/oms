using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.ItemGroupAttrs;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemGroupAttrs
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public ItemGroupAttrUpdateViewModel ItemGroupAttr { get; set; }

        public List<SelectListItem> ItemGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> ProdAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly IItemGroupAttrsAppService _itemGroupAttrsAppService;

        public EditModalModel(IItemGroupAttrsAppService itemGroupAttrsAppService)
        {
            _itemGroupAttrsAppService = itemGroupAttrsAppService;
        }

        public async Task OnGetAsync()
        {
            var itemGroupAttrWithNavigationPropertiesDto = await _itemGroupAttrsAppService.GetWithNavigationPropertiesAsync(Id);
            ItemGroupAttr = ObjectMapper.Map<ItemGroupAttrDto, ItemGroupAttrUpdateViewModel>(itemGroupAttrWithNavigationPropertiesDto.ItemGroupAttr);

            ItemGroupLookupListRequired.AddRange((
                                    await _itemGroupAttrsAppService.GetItemGroupLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            ProdAttributeValueLookupList.AddRange((
                                    await _itemGroupAttrsAppService.GetProdAttributeValueLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _itemGroupAttrsAppService.UpdateAsync(Id, ObjectMapper.Map<ItemGroupAttrUpdateViewModel, ItemGroupAttrUpdateDto>(ItemGroupAttr));
            return NoContent();
        }
    }

    public class ItemGroupAttrUpdateViewModel : ItemGroupAttrUpdateDto
    {
    }
}
