using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.NumberingConfigs;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.NumberingConfigs
{
    public class IndexModel : AbpPageModel
    {
        public int? StartNumberFilterMin { get; set; }

        public int? StartNumberFilterMax { get; set; }
        public string PrefixFilter { get; set; }
        public string SuffixFilter { get; set; }
        public int? LengthFilterMin { get; set; }

        public int? LengthFilterMax { get; set; }
        [SelectItems(nameof(CompanyLookupList))]
        public Guid? CompanyIdFilter { get; set; }
        public List<SelectListItem> CompanyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(SystemDataLookupList))]
        public Guid? SystemDataIdFilter { get; set; }
        public List<SelectListItem> SystemDataLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly INumberingConfigsAppService _numberingConfigsAppService;

        public IndexModel(INumberingConfigsAppService numberingConfigsAppService)
        {
            _numberingConfigsAppService = numberingConfigsAppService;
        }

        public async Task OnGetAsync()
        {
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
    }
}