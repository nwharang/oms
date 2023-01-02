using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.PricelistAssignments;

namespace DMSpro.OMS.MdmService.Web.Pages.PricelistAssignments
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public PricelistAssignmentCreateViewModel PricelistAssignment { get; set; }

        public List<SelectListItem> PriceListLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CustomerGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IPricelistAssignmentsAppService _pricelistAssignmentsAppService;

        public CreateModalModel(IPricelistAssignmentsAppService pricelistAssignmentsAppService)
        {
            _pricelistAssignmentsAppService = pricelistAssignmentsAppService;
        }

        public async Task OnGetAsync()
        {
            PricelistAssignment = new PricelistAssignmentCreateViewModel();
            PriceListLookupListRequired.AddRange((
                                    await _pricelistAssignmentsAppService.GetPriceListLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            CustomerGroupLookupListRequired.AddRange((
                                    await _pricelistAssignmentsAppService.GetCustomerGroupLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _pricelistAssignmentsAppService.CreateAsync(ObjectMapper.Map<PricelistAssignmentCreateViewModel, PricelistAssignmentCreateDto>(PricelistAssignment));
            return NoContent();
        }
    }

    public class PricelistAssignmentCreateViewModel : PricelistAssignmentCreateDto
    {
    }
}
