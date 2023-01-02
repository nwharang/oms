using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.ProdAttributeValues;

namespace DMSpro.OMS.MdmService.Web.Pages.ProdAttributeValues
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public ProdAttributeValueUpdateViewModel ProdAttributeValue { get; set; }

        public List<SelectListItem> ProductAttributeLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> ProdAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly IProdAttributeValuesAppService _prodAttributeValuesAppService;

        public EditModalModel(IProdAttributeValuesAppService prodAttributeValuesAppService)
        {
            _prodAttributeValuesAppService = prodAttributeValuesAppService;
        }

        public async Task OnGetAsync()
        {
            var prodAttributeValueWithNavigationPropertiesDto = await _prodAttributeValuesAppService.GetWithNavigationPropertiesAsync(Id);
            ProdAttributeValue = ObjectMapper.Map<ProdAttributeValueDto, ProdAttributeValueUpdateViewModel>(prodAttributeValueWithNavigationPropertiesDto.ProdAttributeValue);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _prodAttributeValuesAppService.UpdateAsync(Id, ObjectMapper.Map<ProdAttributeValueUpdateViewModel, ProdAttributeValueUpdateDto>(ProdAttributeValue));
            return NoContent();
        }
    }

    public class ProdAttributeValueUpdateViewModel : ProdAttributeValueUpdateDto
    {
    }
}
