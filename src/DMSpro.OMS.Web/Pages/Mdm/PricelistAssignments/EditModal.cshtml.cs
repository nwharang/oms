using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.PricelistAssignments;

namespace DMSpro.OMS.MdmService.Web.Pages.PricelistAssignments
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public PricelistAssignmentUpdateViewModel PricelistAssignment { get; set; }

        public List<SelectListItem> PriceListLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CustomerGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IPricelistAssignmentsAppService _pricelistAssignmentsAppService;

        public EditModalModel(IPricelistAssignmentsAppService pricelistAssignmentsAppService)
        {
            _pricelistAssignmentsAppService = pricelistAssignmentsAppService;
        }

        public async Task OnGetAsync()
        {
            var pricelistAssignmentWithNavigationPropertiesDto = await _pricelistAssignmentsAppService.GetWithNavigationPropertiesAsync(Id);
            PricelistAssignment = ObjectMapper.Map<PricelistAssignmentDto, PricelistAssignmentUpdateViewModel>(pricelistAssignmentWithNavigationPropertiesDto.PricelistAssignment);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _pricelistAssignmentsAppService.UpdateAsync(Id, ObjectMapper.Map<PricelistAssignmentUpdateViewModel, PricelistAssignmentUpdateDto>(PricelistAssignment));
            return NoContent();
        }
    }

    public class PricelistAssignmentUpdateViewModel : PricelistAssignmentUpdateDto
    {
    }
}
