using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.Holidays;

namespace DMSpro.OMS.MdmService.Web.Pages.Holidays
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public HolidayUpdateViewModel Holiday { get; set; }

        private readonly IHolidaysAppService _holidaysAppService;

        public EditModalModel(IHolidaysAppService holidaysAppService)
        {
            _holidaysAppService = holidaysAppService;
        }

        public async Task OnGetAsync()
        {
            var holiday = await _holidaysAppService.GetAsync(Id);
            Holiday = ObjectMapper.Map<HolidayDto, HolidayUpdateViewModel>(holiday);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _holidaysAppService.UpdateAsync(Id, ObjectMapper.Map<HolidayUpdateViewModel, HolidayUpdateDto>(Holiday));
            return NoContent();
        }
    }

    public class HolidayUpdateViewModel : HolidayUpdateDto
    {
    }
}