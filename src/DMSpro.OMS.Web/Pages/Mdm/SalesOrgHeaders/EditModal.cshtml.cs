using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.SalesOrgHeaders;

namespace DMSpro.OMS.MdmService.Web.Pages.SalesOrgHeaders
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public SalesOrgHeaderUpdateViewModel SalesOrgHeader { get; set; }

        private readonly ISalesOrgHeadersAppService _salesOrgHeadersAppService;

        public EditModalModel(ISalesOrgHeadersAppService salesOrgHeadersAppService)
        {
            _salesOrgHeadersAppService = salesOrgHeadersAppService;
        }

        public async Task OnGetAsync()
        {
            var salesOrgHeader = await _salesOrgHeadersAppService.GetAsync(Id);
            SalesOrgHeader = ObjectMapper.Map<SalesOrgHeaderDto, SalesOrgHeaderUpdateViewModel>(salesOrgHeader);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _salesOrgHeadersAppService.UpdateAsync(Id, ObjectMapper.Map<SalesOrgHeaderUpdateViewModel, SalesOrgHeaderUpdateDto>(SalesOrgHeader));
            return NoContent();
        }
    }

    public class SalesOrgHeaderUpdateViewModel : SalesOrgHeaderUpdateDto
    {
    }
}