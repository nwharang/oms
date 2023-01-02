using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.MCPDetails;

namespace DMSpro.OMS.MdmService.Web.Pages.MCPDetails
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public MCPDetailUpdateViewModel MCPDetail { get; set; }

        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> MCPHeaderLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IMCPDetailsAppService _mCPDetailsAppService;

        public EditModalModel(IMCPDetailsAppService mCPDetailsAppService)
        {
            _mCPDetailsAppService = mCPDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            var mCPDetailWithNavigationPropertiesDto = await _mCPDetailsAppService.GetWithNavigationPropertiesAsync(Id);
            MCPDetail = ObjectMapper.Map<MCPDetailDto, MCPDetailUpdateViewModel>(mCPDetailWithNavigationPropertiesDto.MCPDetail);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _mCPDetailsAppService.UpdateAsync(Id, ObjectMapper.Map<MCPDetailUpdateViewModel, MCPDetailUpdateDto>(MCPDetail));
            return NoContent();
        }
    }

    public class MCPDetailUpdateViewModel : MCPDetailUpdateDto
    {
    }
}