using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.CustomerAssignments;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerAssignments
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public CustomerAssignmentUpdateViewModel CustomerAssignment { get; set; }

        public List<SelectListItem> CompanyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerAssignmentsAppService _customerAssignmentsAppService;

        public EditModalModel(ICustomerAssignmentsAppService customerAssignmentsAppService)
        {
            _customerAssignmentsAppService = customerAssignmentsAppService;
        }

        public async Task OnGetAsync()
        {
            var customerAssignmentWithNavigationPropertiesDto = await _customerAssignmentsAppService.GetWithNavigationPropertiesAsync(Id);
            CustomerAssignment = ObjectMapper.Map<CustomerAssignmentDto, CustomerAssignmentUpdateViewModel>(customerAssignmentWithNavigationPropertiesDto.CustomerAssignment);

            CompanyLookupListRequired.AddRange((
                                    await _customerAssignmentsAppService.GetCompanyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            CustomerLookupListRequired.AddRange((
                                    await _customerAssignmentsAppService.GetCustomerLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _customerAssignmentsAppService.UpdateAsync(Id, ObjectMapper.Map<CustomerAssignmentUpdateViewModel, CustomerAssignmentUpdateDto>(CustomerAssignment));
            return NoContent();
        }
    }

    public class CustomerAssignmentUpdateViewModel : CustomerAssignmentUpdateDto
    {
    }
}