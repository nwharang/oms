using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.VisitPlans;

namespace DMSpro.OMS.MdmService.Web.Pages.VisitPlans
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public VisitPlanCreateViewModel VisitPlan { get; set; }

        public List<SelectListItem> MCPDetailLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IVisitPlansAppService _visitPlansAppService;

        public CreateModalModel(IVisitPlansAppService visitPlansAppService)
        {
            _visitPlansAppService = visitPlansAppService;
        }

        public async Task OnGetAsync()
        {
            VisitPlan = new VisitPlanCreateViewModel();
            MCPDetailLookupListRequired.AddRange((
                                    await _visitPlansAppService.GetMCPDetailLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _visitPlansAppService.CreateAsync(ObjectMapper.Map<VisitPlanCreateViewModel, VisitPlanCreateDto>(VisitPlan));
            return NoContent();
        }
    }

    public class VisitPlanCreateViewModel : VisitPlanCreateDto
    {
    }
}