using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.DimensionMeasurements;

namespace DMSpro.OMS.MdmService.Web.Pages.DimensionMeasurements
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public DimensionMeasurementUpdateViewModel DimensionMeasurement { get; set; }

        private readonly IDimensionMeasurementsAppService _dimensionMeasurementsAppService;

        public EditModalModel(IDimensionMeasurementsAppService dimensionMeasurementsAppService)
        {
            _dimensionMeasurementsAppService = dimensionMeasurementsAppService;
        }

        public async Task OnGetAsync()
        {
            var dimensionMeasurement = await _dimensionMeasurementsAppService.GetAsync(Id);
            DimensionMeasurement = ObjectMapper.Map<DimensionMeasurementDto, DimensionMeasurementUpdateViewModel>(dimensionMeasurement);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _dimensionMeasurementsAppService.UpdateAsync(Id, ObjectMapper.Map<DimensionMeasurementUpdateViewModel, DimensionMeasurementUpdateDto>(DimensionMeasurement));
            return NoContent();
        }
    }

    public class DimensionMeasurementUpdateViewModel : DimensionMeasurementUpdateDto
    {
    }
}