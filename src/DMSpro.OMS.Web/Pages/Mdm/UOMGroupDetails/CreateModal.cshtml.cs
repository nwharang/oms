using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.UOMGroupDetails;

namespace DMSpro.OMS.MdmService.Web.Pages.UOMGroupDetails
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public UOMGroupDetailCreateViewModel UOMGroupDetail { get; set; }

        public List<SelectListItem> UOMGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> UOMLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IUOMGroupDetailsAppService _uOMGroupDetailsAppService;

        public CreateModalModel(IUOMGroupDetailsAppService uOMGroupDetailsAppService)
        {
            _uOMGroupDetailsAppService = uOMGroupDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            UOMGroupDetail = new UOMGroupDetailCreateViewModel();
            UOMGroupLookupListRequired.AddRange((
                                    await _uOMGroupDetailsAppService.GetUOMGroupLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            UOMLookupListRequired.AddRange((
                                    await _uOMGroupDetailsAppService.GetUOMLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _uOMGroupDetailsAppService.CreateAsync(ObjectMapper.Map<UOMGroupDetailCreateViewModel, UOMGroupDetailCreateDto>(UOMGroupDetail));
            return NoContent();
        }
    }

    public class UOMGroupDetailCreateViewModel : UOMGroupDetailCreateDto
    {
    }
}
