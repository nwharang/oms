using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CusAttributeValues;

namespace DMSpro.OMS.MdmService.Web.Pages.CusAttributeValues
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CusAttributeValueCreateViewModel CusAttributeValue { get; set; }

        public List<SelectListItem> CustomerAttributeLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CusAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly ICusAttributeValuesAppService _cusAttributeValuesAppService;

        public CreateModalModel(ICusAttributeValuesAppService cusAttributeValuesAppService)
        {
            _cusAttributeValuesAppService = cusAttributeValuesAppService;
        }

        public async Task OnGetAsync()
        {
            CusAttributeValue = new CusAttributeValueCreateViewModel();
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

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _cusAttributeValuesAppService.CreateAsync(ObjectMapper.Map<CusAttributeValueCreateViewModel, CusAttributeValueCreateDto>(CusAttributeValue));
            return NoContent();
        }
    }

    public class CusAttributeValueCreateViewModel : CusAttributeValueCreateDto
    {
    }
}