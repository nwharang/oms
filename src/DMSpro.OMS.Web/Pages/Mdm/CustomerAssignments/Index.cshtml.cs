using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.CustomerAssignments;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerAssignments
{
    public class IndexModel : AbpPageModel
    {
        public DateTime? EffectiveDateFilterMin { get; set; }

        public DateTime? EffectiveDateFilterMax { get; set; }
        public DateTime? EndDateFilterMin { get; set; }

        public DateTime? EndDateFilterMax { get; set; }
        [SelectItems(nameof(CompanyLookupList))]
        public Guid CompanyIdFilter { get; set; }
        public List<SelectListItem> CompanyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        [SelectItems(nameof(CustomerLookupList))]
        public Guid CustomerIdFilter { get; set; }
        public List<SelectListItem> CustomerLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly ICustomerAssignmentsAppService _customerAssignmentsAppService;

        public IndexModel(ICustomerAssignmentsAppService customerAssignmentsAppService)
        {
            _customerAssignmentsAppService = customerAssignmentsAppService;
        }

        public async Task OnGetAsync()
        {
            CompanyLookupList.AddRange((
                    await _customerAssignmentsAppService.GetCompanyLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            CustomerLookupList.AddRange((
                            await _customerAssignmentsAppService.GetCustomerLookupAsync(new LookupRequestDto
                            {
                                MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                            })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                    );

            await Task.CompletedTask;
        }
    }
}