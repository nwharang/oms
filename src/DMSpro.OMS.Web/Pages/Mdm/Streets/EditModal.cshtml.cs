using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.Streets;

namespace DMSpro.OMS.MdmService.Web.Pages.Streets
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public StreetUpdateViewModel Street { get; set; }

        private readonly IStreetsAppService _streetsAppService;

        public EditModalModel(IStreetsAppService streetsAppService)
        {
            _streetsAppService = streetsAppService;
        }

        public async Task OnGetAsync()
        {
            var street = await _streetsAppService.GetAsync(Id);
            Street = ObjectMapper.Map<StreetDto, StreetUpdateViewModel>(street);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _streetsAppService.UpdateAsync(Id, ObjectMapper.Map<StreetUpdateViewModel, StreetUpdateDto>(Street));
            return NoContent();
        }
    }

    public class StreetUpdateViewModel : StreetUpdateDto
    {
    }
}