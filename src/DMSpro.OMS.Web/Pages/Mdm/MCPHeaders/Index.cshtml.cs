using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.MCPHeaders;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.MCPHeaders
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public string NameFilter { get; set; }
        public DateTime? EffectiveDateFilterMin { get; set; }

        public DateTime? EffectiveDateFilterMax { get; set; }
        public DateTime? EndDateFilterMin { get; set; }

        public DateTime? EndDateFilterMax { get; set; }
        [SelectItems(nameof(SalesOrgHierarchyLookupList))]
        public Guid RouteIdFilter { get; set; }
        public List<SelectListItem> SalesOrgHierarchyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(CompanyLookupList))]
        public Guid CompanyIdFilter { get; set; }
        public List<SelectListItem> CompanyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IMCPHeadersAppService _mCPHeadersAppService;

        public IndexModel(IMCPHeadersAppService mCPHeadersAppService)
        {
            _mCPHeadersAppService = mCPHeadersAppService;
        }

        public async Task OnGetAsync()
        {
            SalesOrgHierarchyLookupList.AddRange((
                    await _mCPHeadersAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            CompanyLookupList.AddRange((
                            await _mCPHeadersAppService.GetCompanyLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}