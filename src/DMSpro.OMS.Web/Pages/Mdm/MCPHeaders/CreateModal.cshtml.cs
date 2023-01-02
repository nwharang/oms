using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.MCPHeaders;

namespace DMSpro.OMS.MdmService.Web.Pages.MCPHeaders
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public MCPHeaderCreateViewModel MCPHeader { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CompanyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IMCPHeadersAppService _mCPHeadersAppService;

        public CreateModalModel(IMCPHeadersAppService mCPHeadersAppService)
        {
            _mCPHeadersAppService = mCPHeadersAppService;
        }

        public async Task OnGetAsync()
        {
            MCPHeader = new MCPHeaderCreateViewModel();
            SalesOrgHierarchyLookupListRequired.AddRange((
                                    await _mCPHeadersAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            CompanyLookupListRequired.AddRange((
                                    await _mCPHeadersAppService.GetCompanyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _mCPHeadersAppService.CreateAsync(ObjectMapper.Map<MCPHeaderCreateViewModel, MCPHeaderCreateDto>(MCPHeader));
            return NoContent();
        }
    }

    public class MCPHeaderCreateViewModel : MCPHeaderCreateDto
    {
    }
}