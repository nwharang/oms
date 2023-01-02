using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.MCPDetails;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.MCPDetails
{
    public class IndexModel : AbpPageModel
    {
        public string CodeFilter { get; set; }
        public DateTime? EffectiveDateFilterMin { get; set; }

        public DateTime? EffectiveDateFilterMax { get; set; }
        public DateTime? EndDateFilterMin { get; set; }

        public DateTime? EndDateFilterMax { get; set; }
        public int? DistanceFilterMin { get; set; }

        public int? DistanceFilterMax { get; set; }
        public int? VisitOrderFilterMin { get; set; }

        public int? VisitOrderFilterMax { get; set; }
        [SelectItems(nameof(MondayBoolFilterItems))]
        public string MondayFilter { get; set; }

        public List<SelectListItem> MondayBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(TuesdayBoolFilterItems))]
        public string TuesdayFilter { get; set; }

        public List<SelectListItem> TuesdayBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(WednesdayBoolFilterItems))]
        public string WednesdayFilter { get; set; }

        public List<SelectListItem> WednesdayBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(ThursdayBoolFilterItems))]
        public string ThursdayFilter { get; set; }

        public List<SelectListItem> ThursdayBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(FridayBoolFilterItems))]
        public string FridayFilter { get; set; }

        public List<SelectListItem> FridayBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(SaturdayBoolFilterItems))]
        public string SaturdayFilter { get; set; }

        public List<SelectListItem> SaturdayBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(SundayBoolFilterItems))]
        public string SundayFilter { get; set; }

        public List<SelectListItem> SundayBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(Week1BoolFilterItems))]
        public string Week1Filter { get; set; }

        public List<SelectListItem> Week1BoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(Week2BoolFilterItems))]
        public string Week2Filter { get; set; }

        public List<SelectListItem> Week2BoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(Week3BoolFilterItems))]
        public string Week3Filter { get; set; }

        public List<SelectListItem> Week3BoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(Week4BoolFilterItems))]
        public string Week4Filter { get; set; }

        public List<SelectListItem> Week4BoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(CustomerLookupList))]
        public Guid CustomerIdFilter { get; set; }
        public List<SelectListItem> CustomerLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(MCPHeaderLookupList))]
        public Guid MCPHeaderIdFilter { get; set; }
        public List<SelectListItem> MCPHeaderLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IMCPDetailsAppService _mCPDetailsAppService;

        public IndexModel(IMCPDetailsAppService mCPDetailsAppService)
        {
            _mCPDetailsAppService = mCPDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerLookupList.AddRange((
                    await _mCPDetailsAppService.GetCustomerLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            MCPHeaderLookupList.AddRange((
                            await _mCPDetailsAppService.GetMCPHeaderLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}