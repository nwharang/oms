using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.CusAttributeValues;

namespace DMSpro.OMS.MdmService.Web.Pages.CusAttributeValues
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CusAttributeValueUpdateViewModel CusAttributeValue { get; set; }

        public List<SelectListItem> CustomerAttributeLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CusAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly ICusAttributeValuesAppService _cusAttributeValuesAppService;

        public EditModalModel(ICusAttributeValuesAppService cusAttributeValuesAppService)
        {
            _cusAttributeValuesAppService = cusAttributeValuesAppService;
        }

        public async Task OnGetAsync()
        {
            var cusAttributeValueWithNavigationPropertiesDto = await _cusAttributeValuesAppService.GetWithNavigationPropertiesAsync(Id);
            CusAttributeValue = ObjectMapper.Map<CusAttributeValueDto, CusAttributeValueUpdateViewModel>(cusAttributeValueWithNavigationPropertiesDto.CusAttributeValue);

            CustomerAttributeLookupListRequired.AddRange((
                                    await _cusAttributeValuesAppService.GetCustomerAttributeLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            CusAttributeValueLookupList.AddRange((
                                    await _cusAttributeValuesAppService.GetCusAttributeValueLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _cusAttributeValuesAppService.UpdateAsync(Id, ObjectMapper.Map<CusAttributeValueUpdateViewModel, CusAttributeValueUpdateDto>(CusAttributeValue));
            return NoContent();
        }
    }

    public class CusAttributeValueUpdateViewModel : CusAttributeValueUpdateDto
    {
    }
}