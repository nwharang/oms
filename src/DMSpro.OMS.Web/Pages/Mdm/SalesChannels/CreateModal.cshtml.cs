using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.SalesChannels;

namespace DMSpro.OMS.MdmService.Web.Pages.SalesChannels
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public SalesChannelCreateViewModel SalesChannel { get; set; }

        private readonly ISalesChannelsAppService _salesChannelsAppService;

        public CreateModalModel(ISalesChannelsAppService salesChannelsAppService)
        {
            _salesChannelsAppService = salesChannelsAppService;
        }

        public async Task OnGetAsync()
        {
            SalesChannel = new SalesChannelCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _salesChannelsAppService.CreateAsync(ObjectMapper.Map<SalesChannelCreateViewModel, SalesChannelCreateDto>(SalesChannel));
            return NoContent();
        }
    }

    public class SalesChannelCreateViewModel : SalesChannelCreateDto
    {
    }
}