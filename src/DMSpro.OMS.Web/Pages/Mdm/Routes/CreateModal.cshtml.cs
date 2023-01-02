using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.Routes;

namespace DMSpro.OMS.MdmService.Web.Pages.Routes
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public RouteCreateViewModel Route { get; set; }

        public List<SelectListItem> SystemDataLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> ItemGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> SalesOrgHierarchyLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IRoutesAppService _routesAppService;

        public CreateModalModel(IRoutesAppService routesAppService)
        {
            _routesAppService = routesAppService;
        }

        public async Task OnGetAsync()
        {
            Route = new RouteCreateViewModel();
            SystemDataLookupListRequired.AddRange((
                                    await _routesAppService.GetSystemDataLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            ItemGroupLookupListRequired.AddRange((
                                    await _routesAppService.GetItemGroupLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            SalesOrgHierarchyLookupListRequired.AddRange((
                                    await _routesAppService.GetSalesOrgHierarchyLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _routesAppService.CreateAsync(ObjectMapper.Map<RouteCreateViewModel, RouteCreateDto>(Route));
            return NoContent();
        }
    }

    public class RouteCreateViewModel : RouteCreateDto
    {
    }
}