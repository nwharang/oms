using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.HolidayDetails;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.HolidayDetails
{
    public class IndexModel : AbpPageModel
    {
        public DateTime? StartDateFilterMin { get; set; }

        public DateTime? StartDateFilterMax { get; set; }
        public DateTime? EndDateFilterMin { get; set; }

        public DateTime? EndDateFilterMax { get; set; }
        public string DescriptionFilter { get; set; }
        [SelectItems(nameof(HolidayLookupList))]
        public Guid HolidayIdFilter { get; set; }
        public List<SelectListItem> HolidayLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly IHolidayDetailsAppService _holidayDetailsAppService;

        public IndexModel(IHolidayDetailsAppService holidayDetailsAppService)
        {
            _holidayDetailsAppService = holidayDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            HolidayLookupList.AddRange((
                    await _holidayDetailsAppService.GetHolidayLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            await Task.CompletedTask;
        }
    }
}