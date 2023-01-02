using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.VisitPlans;

namespace DMSpro.OMS.MdmService.Web.Pages.VisitPlans
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public VisitPlanUpdateViewModel VisitPlan { get; set; }

        public List<SelectListItem> MCPDetailLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IVisitPlansAppService _visitPlansAppService;

        public EditModalModel(IVisitPlansAppService visitPlansAppService)
        {
            _visitPlansAppService = visitPlansAppService;
        }

        public async Task OnGetAsync()
        {
            var visitPlanWithNavigationPropertiesDto = await _visitPlansAppService.GetWithNavigationPropertiesAsync(Id);
            VisitPlan = ObjectMapper.Map<VisitPlanDto, VisitPlanUpdateViewModel>(visitPlanWithNavigationPropertiesDto.VisitPlan);

            MCPDetailLookupListRequired.AddRange((
                                    await _visitPlansAppService.GetMCPDetailLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _visitPlansAppService.UpdateAsync(Id, ObjectMapper.Map<VisitPlanUpdateViewModel, VisitPlanUpdateDto>(VisitPlan));
            return NoContent();
        }
    }

    public class VisitPlanUpdateViewModel : VisitPlanUpdateDto
    {
    }
}