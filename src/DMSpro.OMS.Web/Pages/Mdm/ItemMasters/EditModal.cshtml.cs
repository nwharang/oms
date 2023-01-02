using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.ItemMasters;

namespace DMSpro.OMS.MdmService.Web.Pages.ItemMasters
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public ItemMasterUpdateViewModel ItemMaster { get; set; }

        public List<SelectListItem> SystemDataLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> VATLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> UOMGroupLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> UOMLookupListRequired { get; set; } = new List<SelectListItem>
        {
        };
        public List<SelectListItem> ProdAttributeValueLookupList { get; set; } = new List<SelectListItem>
        {
            new SelectListItem(" — ", "")
        };

        private readonly IItemMastersAppService _itemMastersAppService;

        public EditModalModel(IItemMastersAppService itemMastersAppService)
        {
            _itemMastersAppService = itemMastersAppService;
        }

        public async Task OnGetAsync()
        {
            var itemMasterWithNavigationPropertiesDto = await _itemMastersAppService.GetWithNavigationPropertiesAsync(Id);
            ItemMaster = ObjectMapper.Map<ItemMasterDto, ItemMasterUpdateViewModel>(itemMasterWithNavigationPropertiesDto.ItemMaster);

            SystemDataLookupListRequired.AddRange((
                                    await _itemMastersAppService.GetSystemDataLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            VATLookupListRequired.AddRange((
                                    await _itemMastersAppService.GetVATLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            UOMGroupLookupListRequired.AddRange((
                                    await _itemMastersAppService.GetUOMGroupLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            UOMLookupListRequired.AddRange((
                                    await _itemMastersAppService.GetUOMLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );
            ProdAttributeValueLookupList.AddRange((
                                    await _itemMastersAppService.GetProdAttributeValueLookupAsync(new LookupRequestDto
                                    {
                                        MaxResultCount = LimitedResultRequestDto.MaxMaxResultCount
                                    })).Items.Select(t => new SelectListItem(t.DisplayName, t.Id.ToString())).ToList()
                        );

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _itemMastersAppService.UpdateAsync(Id, ObjectMapper.Map<ItemMasterUpdateViewModel, ItemMasterUpdateDto>(ItemMaster));
            return NoContent();
        }
    }

    public class ItemMasterUpdateViewModel : ItemMasterUpdateDto
    {
    }
}
