using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.HolidayDetails;

namespace DMSpro.OMS.MdmService.Web.Pages.HolidayDetails
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public HolidayDetailUpdateViewModel HolidayDetail { get; set; }

        public List<SelectListItem> HolidayLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IHolidayDetailsAppService _holidayDetailsAppService;

        public EditModalModel(IHolidayDetailsAppService holidayDetailsAppService)
        {
            _holidayDetailsAppService = holidayDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            var holidayDetailWithNavigationPropertiesDto = await _holidayDetailsAppService.GetWithNavigationPropertiesAsync(Id);
            HolidayDetail = ObjectMapper.Map<HolidayDetailDto, HolidayDetailUpdateViewModel>(holidayDetailWithNavigationPropertiesDto.HolidayDetail);

            HolidayLookupListRequired.AddRange((
                                    await _holidayDetailsAppService.GetHolidayLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _holidayDetailsAppService.UpdateAsync(Id, ObjectMapper.Map<HolidayDetailUpdateViewModel, HolidayDetailUpdateDto>(HolidayDetail));
            return NoContent();
        }
    }

    public class HolidayDetailUpdateViewModel : HolidayDetailUpdateDto
    {
    }
}