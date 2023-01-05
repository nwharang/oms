using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap.TagHelpers.Form;
using DMSpro.OMS.MdmService.CustomerContacts;
using DMSpro.OMS.MdmService.Shared;

namespace DMSpro.OMS.MdmService.Web.Pages.CustomerContacts
{
    public class IndexModel : AbpPageModel
    {
        public Title? TitleFilter { get; set; }
        public string FirstNameFilter { get; set; }
        public string LastNameFilter { get; set; }
        public Gender? GenderFilter { get; set; }
        public DateTime? DateOfBirthFilterMin { get; set; }

        public DateTime? DateOfBirthFilterMax { get; set; }
        public string PhoneFilter { get; set; }
        public string EmailFilter { get; set; }
        public string AddressFilter { get; set; }
        public string IdentityNumberFilter { get; set; }
        public string BankNameFilter { get; set; }
        public string BankAccNameFilter { get; set; }
        public string BankAccNumberFilter { get; set; }
        [SelectItems(nameof(CustomerProfileLookupList))]
        public Guid CustomerIdFilter { get; set; }
        public List<SelectListItem> CustomerProfileLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(string.Empty, "")
        };

        private readonly ICustomerContactsAppService _customerContactsAppService;

        public IndexModel(ICustomerContactsAppService customerContactsAppService)
        {
            _customerContactsAppService = customerContactsAppService;
        }

        public async Task OnGetAsync()
        {
            CustomerProfileLookupList.AddRange((
                    await _customerContactsAppService.GetCustomerLookupAsync(new LookupRequestDto
                    {
                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
            );

            await Task.CompletedTask;
        }
    }
}