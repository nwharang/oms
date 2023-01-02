using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.UOMGroups;

namespace DMSpro.OMS.MdmService.Web.Pages.UOMGroups
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public UOMGroupUpdateViewModel UOMGroup { get; set; }

        private readonly IUOMGroupsAppService _uOMGroupsAppService;

        public EditModalModel(IUOMGroupsAppService uOMGroupsAppService)
        {
            _uOMGroupsAppService = uOMGroupsAppService;
        }

        public async Task OnGetAsync()
        {
            var uOMGroup = await _uOMGroupsAppService.GetAsync(Id);
            UOMGroup = ObjectMapper.Map<UOMGroupDto, UOMGroupUpdateViewModel>(uOMGroup);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _uOMGroupsAppService.UpdateAsync(Id, ObjectMapper.Map<UOMGroupUpdateViewModel, UOMGroupUpdateDto>(UOMGroup));
            return NoContent();
        }
    }

    public class UOMGroupUpdateViewModel : UOMGroupUpdateDto
    {
    }
}