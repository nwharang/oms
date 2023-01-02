using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.UOMs;

namespace DMSpro.OMS.MdmService.Web.Pages.UOMs
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public UOMUpdateViewModel UOM { get; set; }

        private readonly IUOMsAppService _uOMsAppService;

        public EditModalModel(IUOMsAppService uOMsAppService)
        {
            _uOMsAppService = uOMsAppService;
        }

        public async Task OnGetAsync()
        {
            var uOM = await _uOMsAppService.GetAsync(Id);
            UOM = ObjectMapper.Map<UOMDto, UOMUpdateViewModel>(uOM);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _uOMsAppService.UpdateAsync(Id, ObjectMapper.Map<UOMUpdateViewModel, UOMUpdateDto>(UOM));
            return NoContent();
        }
    }

    public class UOMUpdateViewModel : UOMUpdateDto
    {
    }
}