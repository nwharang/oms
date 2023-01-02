using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.DimensionMeasurements;

namespace DMSpro.OMS.MdmService.Web.Pages.DimensionMeasurements
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public DimensionMeasurementCreateViewModel DimensionMeasurement { get; set; }

        private readonly IDimensionMeasurementsAppService _dimensionMeasurementsAppService;

        public CreateModalModel(IDimensionMeasurementsAppService dimensionMeasurementsAppService)
        {
            _dimensionMeasurementsAppService = dimensionMeasurementsAppService;
        }

        public async Task OnGetAsync()
        {
            DimensionMeasurement = new DimensionMeasurementCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _dimensionMeasurementsAppService.CreateAsync(ObjectMapper.Map<DimensionMeasurementCreateViewModel, DimensionMeasurementCreateDto>(DimensionMeasurement));
            return NoContent();
        }
    }

    public class DimensionMeasurementCreateViewModel : DimensionMeasurementCreateDto
    {
    }
}