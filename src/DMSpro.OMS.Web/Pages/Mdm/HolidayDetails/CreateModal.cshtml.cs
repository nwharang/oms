using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.HolidayDetails;

namespace DMSpro.OMS.MdmService.Web.Pages.HolidayDetails
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public HolidayDetailCreateViewModel HolidayDetail { get; set; }

        public List<SelectListItem> HolidayLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IHolidayDetailsAppService _holidayDetailsAppService;

        public CreateModalModel(IHolidayDetailsAppService holidayDetailsAppService)
        {
            _holidayDetailsAppService = holidayDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            HolidayDetail = new HolidayDetailCreateViewModel();
            HolidayLookupListRequired.AddRange((
                                    await _holidayDetailsAppService.GetHolidayLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _holidayDetailsAppService.CreateAsync(ObjectMapper.Map<HolidayDetailCreateViewModel, HolidayDetailCreateDto>(HolidayDetail));
            return NoContent();
        }
    }

    public class HolidayDetailCreateViewModel : HolidayDetailCreateDto
    {
    }
}