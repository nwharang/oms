using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.WeightMeasurements;

namespace DMSpro.OMS.MdmService.Web.Pages.WeightMeasurements
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public WeightMeasurementCreateViewModel WeightMeasurement { get; set; }

        private readonly IWeightMeasurementsAppService _weightMeasurementsAppService;

        public CreateModalModel(IWeightMeasurementsAppService weightMeasurementsAppService)
        {
            _weightMeasurementsAppService = weightMeasurementsAppService;
        }

        public async Task OnGetAsync()
        {
            WeightMeasurement = new WeightMeasurementCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _weightMeasurementsAppService.CreateAsync(ObjectMapper.Map<WeightMeasurementCreateViewModel, WeightMeasurementCreateDto>(WeightMeasurement));
            return NoContent();
        }
    }

    public class WeightMeasurementCreateViewModel : WeightMeasurementCreateDto
    {
    }
}