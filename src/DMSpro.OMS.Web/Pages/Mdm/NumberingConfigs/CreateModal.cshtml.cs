using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.NumberingConfigs;

namespace DMSpro.OMS.MdmService.Web.Pages.NumberingConfigs
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public NumberingConfigCreateViewModel NumberingConfig { get; set; }

        public List<SelectListItem> CompanyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };
        public List<SelectListItem> SystemDataLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly INumberingConfigsAppService _numberingConfigsAppService;

        public CreateModalModel(INumberingConfigsAppService numberingConfigsAppService)
        {
            _numberingConfigsAppService = numberingConfigsAppService;
        }

        public async Task OnGetAsync()
        {
            NumberingConfig = new NumberingConfigCreateViewModel();
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

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _numberingConfigsAppService.CreateAsync(ObjectMapper.Map<NumberingConfigCreateViewModel, NumberingConfigCreateDto>(NumberingConfig));
            return NoContent();
        }
    }

    public class NumberingConfigCreateViewModel : NumberingConfigCreateDto
    {
    }
}