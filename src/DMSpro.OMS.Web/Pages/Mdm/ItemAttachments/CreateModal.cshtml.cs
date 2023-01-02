using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.ItemAttachments;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemAttachments
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public ItemAttachmentCreateViewModel ItemAttachment { get; set; }

        public List<SelectListItem> ItemMasterLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IItemAttachmentsAppService _itemAttachmentsAppService;

        public CreateModalModel(IItemAttachmentsAppService itemAttachmentsAppService)
        {
            _itemAttachmentsAppService = itemAttachmentsAppService;
        }

        public async Task OnGetAsync()
        {
            ItemAttachment = new ItemAttachmentCreateViewModel();
            ItemMasterLookupListRequired.AddRange((
                                    await _itemAttachmentsAppService.GetItemMasterLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _itemAttachmentsAppService.CreateAsync(ObjectMapper.Map<ItemAttachmentCreateViewModel, ItemAttachmentCreateDto>(ItemAttachment));
            return NoContent();
        }
    }

    public class ItemAttachmentCreateViewModel : ItemAttachmentCreateDto
    {
    }
}
