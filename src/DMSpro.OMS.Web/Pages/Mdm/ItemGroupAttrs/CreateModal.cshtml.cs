using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.ItemGroupAttrs;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemGroupAttrs
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public ItemGroupAttrCreateViewModel ItemGroupAttr { get; set; }

        public List<SelectListItem> ItemGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> ProdAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly IItemGroupAttrsAppService _itemGroupAttrsAppService;

        public CreateModalModel(IItemGroupAttrsAppService itemGroupAttrsAppService)
        {
            _itemGroupAttrsAppService = itemGroupAttrsAppService;
        }

        public async Task OnGetAsync()
        {
            ItemGroupAttr = new ItemGroupAttrCreateViewModel();
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

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _itemGroupAttrsAppService.CreateAsync(ObjectMapper.Map<ItemGroupAttrCreateViewModel, ItemGroupAttrCreateDto>(ItemGroupAttr));
            return NoContent();
        }
    }

    public class ItemGroupAttrCreateViewModel : ItemGroupAttrCreateDto
    {
    }
}
