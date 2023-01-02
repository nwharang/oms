using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.SalesOrgHierarchies;

namespace DMSpro.OMS.MdmService.Web.Pages.SalesOrgHierarchies
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public SalesOrgHierarchyUpdateViewModel SalesOrgHierarchy { get; set; }

        public List<SelectListItem> SalesOrgHeaderLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> SalesOrgHierarchyLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly ISalesOrgHierarchiesAppService _salesOrgHierarchiesAppService;

        public EditModalModel(ISalesOrgHierarchiesAppService salesOrgHierarchiesAppService)
        {
            _salesOrgHierarchiesAppService = salesOrgHierarchiesAppService;
        }

        public async Task OnGetAsync()
        {
            var salesOrgHierarchyWithNavigationPropertiesDto = await _salesOrgHierarchiesAppService.GetWithNavigationPropertiesAsync(Id);
            SalesOrgHierarchy = ObjectMapper.Map<SalesOrgHierarchyDto, SalesOrgHierarchyUpdateViewModel>(salesOrgHierarchyWithNavigationPropertiesDto.SalesOrgHierarchy);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _salesOrgHierarchiesAppService.UpdateAsync(Id, ObjectMapper.Map<SalesOrgHierarchyUpdateViewModel, SalesOrgHierarchyUpdateDto>(SalesOrgHierarchy));
            return NoContent();
        }
    }

    public class SalesOrgHierarchyUpdateViewModel : SalesOrgHierarchyUpdateDto
    {
    }
}