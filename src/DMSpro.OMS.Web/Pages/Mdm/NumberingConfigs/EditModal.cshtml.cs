using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.NumberingConfigs;

namespace DMSpro.OMS.MdmService.Web.Pages.NumberingConfigs
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public NumberingConfigUpdateViewModel NumberingConfig { get; set; }

        public List<SelectListItem> CompanyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };
        public List<SelectListItem> SystemDataLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly INumberingConfigsAppService _numberingConfigsAppService;

        public EditModalModel(INumberingConfigsAppService numberingConfigsAppService)
        {
            _numberingConfigsAppService = numberingConfigsAppService;
        }

        public async Task OnGetAsync()
        {
            var numberingConfigWithNavigationPropertiesDto = await _numberingConfigsAppService.GetWithNavigationPropertiesAsync(Id);
            NumberingConfig = ObjectMapper.Map<NumberingConfigDto, NumberingConfigUpdateViewModel>(numberingConfigWithNavigationPropertiesDto.NumberingConfig);

            CompanyLookupList.AddRange((
                                    await _numberingConfigsAppService.GetCompanyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            SystemDataLookupList.AddRange((
                                    await _numberingConfigsAppService.GetSystemDataLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _numberingConfigsAppService.UpdateAsync(Id, ObjectMapper.Map<NumberingConfigUpdateViewModel, NumberingConfigUpdateDto>(NumberingConfig));
            return NoContent();
        }
    }

    public class NumberingConfigUpdateViewModel : NumberingConfigUpdateDto
    {
    }
}