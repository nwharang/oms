using DMSpro.OMS.MdmService.Shared;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DMSpro.OMS.MdmService.ProductAttributes;

namespace DMSpro.OMS.MdmService.Web.Pages.ProductAttributes
{
    public class CreateModalModel : MdmServicePageModel
    {
        [BindProperty]
        public ProductAttributeCreateViewModel ProductAttribute { get; set; }

        private readonly IProductAttributesAppService _productAttributesAppService;

        public CreateModalModel(IProductAttributesAppService productAttributesAppService)
        {
            _productAttributesAppService = productAttributesAppService;
        }

        public async Task OnGetAsync()
        {
            ProductAttribute = new ProductAttributeCreateViewModel();

            await Task.CompletedTask;
        }

        public async Task<IActionResult> OnPostAsync()
        {

            await _productAttributesAppService.CreateAsync(ObjectMapper.Map<ProductAttributeCreateViewModel, ProductAttributeCreateDto>(ProductAttribute));
            return NoContent();
        }
    }

    public class ProductAttributeCreateViewModel : ProductAttributeCreateDto
    {
    }
}