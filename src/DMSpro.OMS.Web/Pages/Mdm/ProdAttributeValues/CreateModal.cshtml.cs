using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.ProdAttributeValues;

namespace DMSpro.OMS.MdmService.Web.Pages.ProdAttributeValues
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public ProdAttributeValueCreateViewModel ProdAttributeValue { get; set; }

        public List<SelectListItem> ProductAttributeLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> ProdAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly IProdAttributeValuesAppService _prodAttributeValuesAppService;

        public CreateModalModel(IProdAttributeValuesAppService prodAttributeValuesAppService)
        {
            _prodAttributeValuesAppService = prodAttributeValuesAppService;
        }

        public async Task OnGetAsync()
        {
            ProdAttributeValue = new ProdAttributeValueCreateViewModel();
            ProductAttributeLookupListRequired.AddRange((
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

        public async Task<IActionResult> OnPostAsync()
        {

            await _prodAttributeValuesAppService.CreateAsync(ObjectMapper.Map<ProdAttributeValueCreateViewModel, ProdAttributeValueCreateDto>(ProdAttributeValue));
            return NoContent();
        }
    }

    public class ProdAttributeValueCreateViewModel : ProdAttributeValueCreateDto
    {
    }
}
