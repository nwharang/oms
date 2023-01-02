using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.Holidays;

namespace DMSpro.OMS.MdmService.Web.Pages.Holidays
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public HolidayCreateViewModel Holiday { get; set; }

        private readonly IHolidaysAppService _holidaysAppService;

        public CreateModalModel(IHolidaysAppService holidaysAppService)
        {
            _holidaysAppService = holidaysAppService;
        }

        public async Task OnGetAsync()
        {
            Holiday = new HolidayCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _holidaysAppService.CreateAsync(ObjectMapper.Map<HolidayCreateViewModel, HolidayCreateDto>(Holiday));
            return NoContent();
        }
    }

    public class HolidayCreateViewModel : HolidayCreateDto
    {
    }
}