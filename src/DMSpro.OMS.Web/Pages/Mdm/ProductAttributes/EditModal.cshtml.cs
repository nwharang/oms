using DMSpro.OMS.MdmService.Shared;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using DMSpro.OMS.MdmService.ProductAttributes;

namespace DMSpro.OMS.MdmService.Web.Pages.ProductAttributes
{
    public class EditModalModel : MdmServicePageModel
    {
        [HiddenInput]
        [BindProperty(SupportsGet = true)]
        public Guid Id { get; set; }

        [BindProperty]
        public ProductAttributeUpdateViewModel ProductAttribute { get; set; }

        private readonly IProductAttributesAppService _productAttributesAppService;

        public EditModalModel(IProductAttributesAppService productAttributesAppService)
        {
            _productAttributesAppService = productAttributesAppService;
        }

        public async Task OnGetAsync()
        {
            var productAttribute = await _productAttributesAppService.GetAsync(Id);
            ProductAttribute = ObjectMapper.Map<ProductAttributeDto, ProductAttributeUpdateViewModel>(productAttribute);

        }

        public async Task<NoContentResult> OnPostAsync()
        {

            await _productAttributesAppService.UpdateAsync(Id, ObjectMapper.Map<ProductAttributeUpdateViewModel, ProductAttributeUpdateDto>(ProductAttribute));
            return NoContent();
        }
    }

    public class ProductAttributeUpdateViewModel : ProductAttributeUpdateDto
    {
    }
}