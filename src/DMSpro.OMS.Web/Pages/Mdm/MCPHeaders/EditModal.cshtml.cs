using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.MCPHeaders;

namespace DMSpro.OMS.MdmService.Web.Pages.MCPHeaders
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public MCPHeaderUpdateViewModel MCPHeader { get; set; }

        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CompanyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IMCPHeadersAppService _mCPHeadersAppService;

        public EditModalModel(IMCPHeadersAppService mCPHeadersAppService)
        {
            _mCPHeadersAppService = mCPHeadersAppService;
        }

        public async Task OnGetAsync()
        {
            var mCPHeaderWithNavigationPropertiesDto = await _mCPHeadersAppService.GetWithNavigationPropertiesAsync(Id);
            MCPHeader = ObjectMapper.Map<MCPHeaderDto, MCPHeaderUpdateViewModel>(mCPHeaderWithNavigationPropertiesDto.MCPHeader);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _mCPHeadersAppService.UpdateAsync(Id, ObjectMapper.Map<MCPHeaderUpdateViewModel, MCPHeaderUpdateDto>(MCPHeader));
            return NoContent();
        }
    }

    public class MCPHeaderUpdateViewModel : MCPHeaderUpdateDto
    {
    }
}