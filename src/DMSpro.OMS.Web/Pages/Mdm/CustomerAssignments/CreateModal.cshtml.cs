using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.CustomerAssignments;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerAssignments
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public CustomerAssignmentCreateViewModel CustomerAssignment { get; set; }

        public List<SelectListItem> CompanyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> CustomerLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly ICustomerAssignmentsAppService _customerAssignmentsAppService;

        public CreateModalModel(ICustomerAssignmentsAppService customerAssignmentsAppService)
        {
            _customerAssignmentsAppService = customerAssignmentsAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerAssignment = new CustomerAssignmentCreateViewModel();
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

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _customerAssignmentsAppService.CreateAsync(ObjectMapper.Map<CustomerAssignmentCreateViewModel, CustomerAssignmentCreateDto>(CustomerAssignment));
            return NoContent();
        }
    }

    public class CustomerAssignmentCreateViewModel : CustomerAssignmentCreateDto
    {
    }
}