using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.ItemMasters;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemMasters
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public string NameFilter { get; set; }
        public string ShortNameFilter { get; set; }
        public string ERPCodeFilter { get; set; }
        public string BarcodeFilter { get; set; }
        [SelectItems(nameof(PurchasbleBoolFilterItems))]
        public string PurchasbleFilter { get; set; }

        public List<SelectListItem> PurchasbleBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(SaleableBoolFilterItems))]
        public string SaleableFilter { get; set; }

        public List<SelectListItem> SaleableBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(InventoriableBoolFilterItems))]
        public string InventoriableFilter { get; set; }

        public List<SelectListItem> InventoriableBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(ActiveBoolFilterItems))]
        public string ActiveFilter { get; set; }

        public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        public ManageType? ManageTypeFilter { get; set; }
        public ExpiredType? ExpiredTypeFilter { get; set; }
        public int? ExpiredValueFilterMin { get; set; }

        public int? ExpiredValueFilterMax { get; set; }
        public IssueMethod? IssueMethodFilter { get; set; }
        [SelectItems(nameof(CanUpdateBoolFilterItems))]
        public string CanUpdateFilter { get; set; }

        public List<SelectListItem> CanUpdateBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        public int? BasePriceFilterMin { get; set; }

        public int? BasePriceFilterMax { get; set; }
        [SelectItems(nameof(SystemDataLookupList))]
        public Guid ItemTypeIdFilter { get; set; }
        public List<SelectListItem> SystemDataLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(VATLookupList))]
        public Guid VATIdFilter { get; set; }
        public List<SelectListItem> VATLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(UOMGroupLookupList))]
        public Guid UOMGroupIdFilter { get; set; }
        public List<SelectListItem> UOMGroupLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(UOMLookupList))]
        public Guid InventoryUnitIdFilter { get; set; }
        public List<SelectListItem> UOMLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(UOMLookupList))]
        public Guid PurUnitIdFilter { get; set; }
        [SelectItems(nameof(UOMLookupList))]
        public Guid SalesUnitFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr0IdFilter { get; set; }
        public List<SelectListItem> ProdAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr1IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr2IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr3IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr4IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr5IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr6IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr7IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr8IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr9IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr10IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr11IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr12IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr13IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr14IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr15IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr16IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr17IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr18IdFilter { get; set; }
        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? Attr19IdFilter { get; set; }

        private readonly IItemMastersAppService _itemMastersAppService;

        public IndexModel(IItemMastersAppService itemMastersAppService)
        {
            _itemMastersAppService = itemMastersAppService;
        }

        public async Task OnGetAsync()
        {
            SystemDataLookupList.AddRange((
                    await _itemMastersAppService.GetSystemDataLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            VATLookupList.AddRange((
                            await _itemMastersAppService.GetVATLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            UOMGroupLookupList.AddRange((
                            await _itemMastersAppService.GetUOMGroupLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            UOMLookupList.AddRange((
                            await _itemMastersAppService.GetUOMLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            ProdAttributeValueLookupList.AddRange((
                            await _itemMastersAppService.GetProdAttributeValueLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}
