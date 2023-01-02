using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.SalesOrgHeaders;

namespace DMSpro.OMS.MdmService.Web.Pages.SalesOrgHeaders
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public SalesOrgHeaderCreateViewModel SalesOrgHeader { get; set; }

        private readonly ISalesOrgHeadersAppService _salesOrgHeadersAppService;

        public CreateModalModel(ISalesOrgHeadersAppService salesOrgHeadersAppService)
        {
            _salesOrgHeadersAppService = salesOrgHeadersAppService;
        }

        public async Task OnGetAsync()
        {
            SalesOrgHeader = new SalesOrgHeaderCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _salesOrgHeadersAppService.CreateAsync(ObjectMapper.Map<SalesOrgHeaderCreateViewModel, SalesOrgHeaderCreateDto>(SalesOrgHeader));
            return NoContent();
        }
    }

    public class SalesOrgHeaderCreateViewModel : SalesOrgHeaderCreateDto
    {
    }
}