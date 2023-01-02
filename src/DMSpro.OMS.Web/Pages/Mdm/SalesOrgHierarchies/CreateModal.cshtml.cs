using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.SalesOrgHierarchies;

namespace DMSpro.OMS.MdmService.Web.Pages.SalesOrgHierarchies
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public SalesOrgHierarchyCreateViewModel SalesOrgHierarchy { get; set; }

        public List<SelectListItem> SalesOrgHeaderLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> SalesOrgHierarchyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly ISalesOrgHierarchiesAppService _salesOrgHierarchiesAppService;

        public CreateModalModel(ISalesOrgHierarchiesAppService salesOrgHierarchiesAppService)
        {
            _salesOrgHierarchiesAppService = salesOrgHierarchiesAppService;
        }

        public async Task OnGetAsync()
        {
            SalesOrgHierarchy = new SalesOrgHierarchyCreateViewModel();
            SalesOrgHeaderLookupListRequired.AddRange((
                                    await _salesOrgHierarchiesAppService.GetSalesOrgHeaderLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            SalesOrgHierarchyLookupList.AddRange((
                                    await _salesOrgHierarchiesAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _salesOrgHierarchiesAppService.CreateAsync(ObjectMapper.Map<SalesOrgHierarchyCreateViewModel, SalesOrgHierarchyCreateDto>(SalesOrgHierarchy));
            return NoContent();
        }
    }

    public class SalesOrgHierarchyCreateViewModel : SalesOrgHierarchyCreateDto
    {
    }
}