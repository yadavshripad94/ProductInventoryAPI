using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductInventoryAPI.DTOs;
using ProductInventoryAPI.Models;
using ProductInventoryAPI.Services;

namespace ProductInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductStore _productStore;

        public ProductsController(ProductStore productStore)
        {
            _productStore = productStore;
        }

        // Get all products
        // GET/api/products	
        [HttpGet]
        public ActionResult<IReadOnlyList<Product>> GetAll()
        {
            return Ok(_productStore.GetAll());
        }

        // Get one product
        // GET	/api/products/{id}	
        [HttpGet("{id:int}")]
        public ActionResult<Product> GetById(int id)
        {
            Product? product = _productStore.GetById(id);

            if (product is null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // Create a product
        // POST	/api/products	
        [HttpPost]
        public ActionResult<Product> Create(ProductRequestDTO request)
        {
            Product product = _productStore.Add(request);

            return CreatedAtAction(
nameof(GetById),
                new { id = product.Id },
                product);
        }

        // Update a product
        // PUT	/api/products/{id}	
        [HttpPut("{id:int}")]
        public ActionResult<Product> Update(int id, ProductRequestDTO request)
        {
            Product? product = _productStore.Update(id, request);

            if (product is null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // Delete a product
        // DELETE	/api/products/{id}	
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            bool deleted = _productStore.Delete(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }

}
