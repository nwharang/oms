using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.ItemAttachments;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemAttachments
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public ItemAttachmentUpdateViewModel ItemAttachment { get; set; }

        public List<SelectListItem> ItemMasterLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };

        private readonly IItemAttachmentsAppService _itemAttachmentsAppService;

        public EditModalModel(IItemAttachmentsAppService itemAttachmentsAppService)
        {
            _itemAttachmentsAppService = itemAttachmentsAppService;
        }

        public async Task OnGetAsync()
        {
            var itemAttachmentWithNavigationPropertiesDto = await _itemAttachmentsAppService.GetWithNavigationPropertiesAsync(Id);
            ItemAttachment = ObjectMapper.Map<ItemAttachmentDto, ItemAttachmentUpdateViewModel>(itemAttachmentWithNavigationPropertiesDto.ItemAttachment);

            ItemMasterLookupListRequired.AddRange((
                                    await _itemAttachmentsAppService.GetItemMasterLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _itemAttachmentsAppService.UpdateAsync(Id, ObjectMapper.Map<ItemAttachmentUpdateViewModel, ItemAttachmentUpdateDto>(ItemAttachment));
            return NoContent();
        }
    }

    public class ItemAttachmentUpdateViewModel : ItemAttachmentUpdateDto
    {
    }
}
