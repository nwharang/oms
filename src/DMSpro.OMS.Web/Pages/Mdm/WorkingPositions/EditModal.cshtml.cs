using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.WorkingPositions;

namespace DMSpro.OMS.MdmService.Web.Pages.WorkingPositions
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public WorkingPositionUpdateViewModel WorkingPosition { get; set; }

        private readonly IWorkingPositionsAppService _workingPositionsAppService;

        public EditModalModel(IWorkingPositionsAppService workingPositionsAppService)
        {
            _workingPositionsAppService = workingPositionsAppService;
        }

        public async Task OnGetAsync()
        {
            var workingPosition = await _workingPositionsAppService.GetAsync(Id);
            WorkingPosition = ObjectMapper.Map<WorkingPositionDto, WorkingPositionUpdateViewModel>(workingPosition);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _workingPositionsAppService.UpdateAsync(Id, ObjectMapper.Map<WorkingPositionUpdateViewModel, WorkingPositionUpdateDto>(WorkingPosition));
            return NoContent();
        }
    }

    public class WorkingPositionUpdateViewModel : WorkingPositionUpdateDto
    {
    }
}