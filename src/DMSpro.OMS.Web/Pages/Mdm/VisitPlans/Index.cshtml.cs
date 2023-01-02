using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.VisitPlans;
using DMSpro.OMS.MdmService.Shared;
using DayOfWeek = DMSpro.OMS.MdmService.VisitPlans.DayOfWeek;

namespace DMSpro.OMS.MdmService.Web.Pages.VisitPlans
{
    public class IndexModel : AbpPageModel
    {
        public DateTime? DateVisitFilterMin { get; set; }

        public DateTime? DateVisitFilterMax { get; set; }
        public int? DistanceFilterMin { get; set; }

        public int? DistanceFilterMax { get; set; }
        public int? VisitOrderFilterMin { get; set; }

        public int? VisitOrderFilterMax { get; set; }
        public DayOfWeek? DayOfWeekFilter { get; set; }
        public int? WeekFilterMin { get; set; }

        public int? WeekFilterMax { get; set; }
        public int? MonthFilterMin { get; set; }

        public int? MonthFilterMax { get; set; }
        public int? YearFilterMin { get; set; }

        public int? YearFilterMax { get; set; }
        [SelectItems(nameof(MCPDetailLookupList))]
        public Guid MCPDetailIdFilter { get; set; }
        public List<SelectListItem> MCPDetailLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IVisitPlansAppService _visitPlansAppService;

        public IndexModel(IVisitPlansAppService visitPlansAppService)
        {
            _visitPlansAppService = visitPlansAppService;
        }

        public async Task OnGetAsync()
        {
            MCPDetailLookupList.AddRange((
                    await _visitPlansAppService.GetMCPDetailLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            await Task.CompletedTask;
        }
    }
}