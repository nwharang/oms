using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.ItemGroupAttrs;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemGroupAttrs
{
    public class IndexModel : AbpPageModel
    {
        [SelectItems(nameof(ItemGroupLookupList))]
        public Guid ItemGroupIdFilter { get; set; }
        public List<SelectListItem> ItemGroupLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr0Filter { get; set; }
        public List<SelectListItem> ProdAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr1Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr2Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr3Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr4Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr5Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr6Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr7Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr8Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr9Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr10Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr11Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr12Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr13Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr14Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr15Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr16Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr17Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr18Filter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr19Filter { get; set; }

        private readonly IItemGroupAttrsAppService _itemGroupAttrsAppService;

        public IndexModel(IItemGroupAttrsAppService itemGroupAttrsAppService)
        {
            _itemGroupAttrsAppService = itemGroupAttrsAppService;
        }

        public async Task OnGetAsync()
        {
            ItemGroupLookupList.AddRange((
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
    }
}
