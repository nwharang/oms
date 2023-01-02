using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.UOMGroupDetails;

namespace DMSpro.OMS.MdmService.Web.Pages.UOMGroupDetails
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public UOMGroupDetailUpdateViewModel UOMGroupDetail { get; set; }

        public List<SelectListItem> UOMGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> UOMLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IUOMGroupDetailsAppService _uOMGroupDetailsAppService;

        public EditModalModel(IUOMGroupDetailsAppService uOMGroupDetailsAppService)
        {
            _uOMGroupDetailsAppService = uOMGroupDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            var uOMGroupDetailWithNavigationPropertiesDto = await _uOMGroupDetailsAppService.GetWithNavigationPropertiesAsync(Id);
            UOMGroupDetail = ObjectMapper.Map<UOMGroupDetailDto, UOMGroupDetailUpdateViewModel>(uOMGroupDetailWithNavigationPropertiesDto.UOMGroupDetail);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _uOMGroupDetailsAppService.UpdateAsync(Id, ObjectMapper.Map<UOMGroupDetailUpdateViewModel, UOMGroupDetailUpdateDto>(UOMGroupDetail));
            return NoContent();
        }
    }

    public class UOMGroupDetailUpdateViewModel : UOMGroupDetailUpdateDto
    {
    }
}
