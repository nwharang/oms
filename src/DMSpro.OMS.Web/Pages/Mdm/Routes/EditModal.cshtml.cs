using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.Routes;

namespace DMSpro.OMS.MdmService.Web.Pages.Routes
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public RouteUpdateViewModel Route { get; set; }

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

        public EditModalModel(IRoutesAppService routesAppService)
        {
            _routesAppService = routesAppService;
        }

        public async Task OnGetAsync()
        {
            var routeWithNavigationPropertiesDto = await _routesAppService.GetWithNavigationPropertiesAsync(Id);
            Route = ObjectMapper.Map<RouteDto, RouteUpdateViewModel>(routeWithNavigationPropertiesDto.Route);

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

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _routesAppService.UpdateAsync(Id, ObjectMapper.Map<RouteUpdateViewModel, RouteUpdateDto>(Route));
            return NoContent();
        }
    }

    public class RouteUpdateViewModel : RouteUpdateDto
    {
    }
}