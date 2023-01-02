using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.WeightMeasurements;

namespace DMSpro.OMS.MdmService.Web.Pages.WeightMeasurements
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public WeightMeasurementUpdateViewModel WeightMeasurement { get; set; }

        private readonly IWeightMeasurementsAppService _weightMeasurementsAppService;

        public EditModalModel(IWeightMeasurementsAppService weightMeasurementsAppService)
        {
            _weightMeasurementsAppService = weightMeasurementsAppService;
        }

        public async Task OnGetAsync()
        {
            var weightMeasurement = await _weightMeasurementsAppService.GetAsync(Id);
            WeightMeasurement = ObjectMapper.Map<WeightMeasurementDto, WeightMeasurementUpdateViewModel>(weightMeasurement);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _weightMeasurementsAppService.UpdateAsync(Id, ObjectMapper.Map<WeightMeasurementUpdateViewModel, WeightMeasurementUpdateDto>(WeightMeasurement));
            return NoContent();
        }
    }

    public class WeightMeasurementUpdateViewModel : WeightMeasurementUpdateDto
    {
    }
}