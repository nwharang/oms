using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.MCPDetails;

namespace DMSpro.OMS.MdmService.Web.Pages.MCPDetails
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public MCPDetailCreateViewModel MCPDetail { get; set; }

        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> MCPHeaderLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IMCPDetailsAppService _mCPDetailsAppService;

        public CreateModalModel(IMCPDetailsAppService mCPDetailsAppService)
        {
            _mCPDetailsAppService = mCPDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            MCPDetail = new MCPDetailCreateViewModel();
            CustomerLookupListRequired.AddRange((
                                    await _mCPDetailsAppService.GetCustomerLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            MCPHeaderLookupListRequired.AddRange((
                                    await _mCPDetailsAppService.GetMCPHeaderLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _mCPDetailsAppService.CreateAsync(ObjectMapper.Map<MCPDetailCreateViewModel, MCPDetailCreateDto>(MCPDetail));
            return NoContent();
        }
    }

    public class MCPDetailCreateViewModel : MCPDetailCreateDto
    {
    }
}