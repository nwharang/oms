using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.WorkingPositions;

namespace DMSpro.OMS.MdmService.Web.Pages.WorkingPositions
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public WorkingPositionCreateViewModel WorkingPosition { get; set; }

        private readonly IWorkingPositionsAppService _workingPositionsAppService;

        public CreateModalModel(IWorkingPositionsAppService workingPositionsAppService)
        {
            _workingPositionsAppService = workingPositionsAppService;
        }

        public async Task OnGetAsync()
        {
            WorkingPosition = new WorkingPositionCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _workingPositionsAppService.CreateAsync(ObjectMapper.Map<WorkingPositionCreateViewModel, WorkingPositionCreateDto>(WorkingPosition));
            return NoContent();
        }
    }

    public class WorkingPositionCreateViewModel : WorkingPositionCreateDto
    {
    }
}