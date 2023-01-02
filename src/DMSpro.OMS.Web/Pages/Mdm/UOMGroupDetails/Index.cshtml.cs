using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.UOMGroupDetails;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.UOMGroupDetails
{
    public class IndexModel : AbpPageModel
    {
        public uint? AltQtyFilterMin { get; set; }

        public uint? AltQtyFilterMax { get; set; }
        public uint? BaseQtyFilterMin { get; set; }

        public uint? BaseQtyFilterMax { get; set; }
        [SelectItems(nameof(ActiveBoolFilterItems))]
        public string ActiveFilter { get; set; }

        public List<SelectListItem> ActiveBoolFilterItems { get; set; } =
            new List<SelectListItem>
            {
                new SelectListItem("", ""),
                new SelectListItem("Yes", "true"),
                new SelectListItem("No", "false"),
            };
        [SelectItems(nameof(UOMGroupLookupList))]
        public Guid UOMGroupIdFilter { get; set; }
        public List<SelectListItem> UOMGroupLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(UOMLookupList))]
        public Guid AltUOMIdFilter { get; set; }
        public List<SelectListItem> UOMLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(UOMLookupList))]
        public Guid BaseUOMIdFilter { get; set; }

        private readonly IUOMGroupDetailsAppService _uOMGroupDetailsAppService;

        public IndexModel(IUOMGroupDetailsAppService uOMGroupDetailsAppService)
        {
            _uOMGroupDetailsAppService = uOMGroupDetailsAppService;
        }

        public async Task OnGetAsync()
        {
            UOMGroupLookupList.AddRange((
                    await _uOMGroupDetailsAppService.GetUOMGroupLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            UOMLookupList.AddRange((
                            await _uOMGroupDetailsAppService.GetUOMLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}
