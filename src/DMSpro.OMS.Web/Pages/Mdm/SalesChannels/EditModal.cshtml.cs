using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.SalesChannels;

namespace DMSpro.OMS.MdmService.Web.Pages.SalesChannels
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public SalesChannelUpdateViewModel SalesChannel { get; set; }

        private readonly ISalesChannelsAppService _salesChannelsAppService;

        public EditModalModel(ISalesChannelsAppService salesChannelsAppService)
        {
            _salesChannelsAppService = salesChannelsAppService;
        }

        public async Task OnGetAsync()
        {
            var salesChannel = await _salesChannelsAppService.GetAsync(Id);
            SalesChannel = ObjectMapper.Map<SalesChannelDto, SalesChannelUpdateViewModel>(salesChannel);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _salesChannelsAppService.UpdateAsync(Id, ObjectMapper.Map<SalesChannelUpdateViewModel, SalesChannelUpdateDto>(SalesChannel));
            return NoContent();
        }
    }

    public class SalesChannelUpdateViewModel : SalesChannelUpdateDto
    {
    }
}