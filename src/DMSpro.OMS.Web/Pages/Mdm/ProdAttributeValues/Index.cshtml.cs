using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.ProdAttributeValues;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.ProdAttributeValues
{
    public class IndexModel : AbpPageModel
    {
        public string AttrValNameFilter { get; set; }
        [SelectItems(nameof(ProductAttributeLookupList))]
        public Guid ProdAttributeIdFilter { get; set; }
        public List<SelectListItem> ProductAttributeLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(ProdAttributeValueLookupList))]
        public Guid? ParentProdAttributeValueIdFilter { get; set; }
        public List<SelectListItem> ProdAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IProdAttributeValuesAppService _prodAttributeValuesAppService;

        public IndexModel(IProdAttributeValuesAppService prodAttributeValuesAppService)
        {
            _prodAttributeValuesAppService = prodAttributeValuesAppService;
        }

        public async Task OnGetAsync()
        {
            ProductAttributeLookupList.AddRange((
                    await _prodAttributeValuesAppService.GetProductAttributeLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            ProdAttributeValueLookupList.AddRange((
                            await _prodAttributeValuesAppService.GetProdAttributeValueLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}
