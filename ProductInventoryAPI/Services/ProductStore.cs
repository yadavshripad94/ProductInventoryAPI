using ProductInventoryAPI.DTOs;
using ProductInventoryAPI.Models;
using System.Xml.Linq;

namespace ProductInventoryAPI.Services
{
    public class ProductStore
    {
        private readonly List<Product> _products = new List<Product>()
        {
            new Product
            {
                Id = 1, Name = "Laptop", Category = "Electronics", Price = 65000, StockQuantity = 8, IsActive = true
            },
            new Product
            {
                Id = 2, Name = "Wireless Mouse", Category = "Electronics", Price = 1500, StockQuantity = 25, IsActive = true
            },
            new Product
            {
                Id = 3, Name = "Office Chair", Category = "Furniture", Price = 8500, StockQuantity = 4, IsActive = true
            },
            new Product
            {
                Id = 4, Name = "Study Table", Category = "Furniture", Price = 12000, StockQuantity = 3, IsActive = true
            },
            new Product
            {
                Id = 5, Name = "Water Bottle", Category = "Home", Price = 650, StockQuantity = 40, IsActive = true
            },
            new Product
            {
                Id = 6, Name = "Old Keyboard", Category = "Electronics", Price = 900, StockQuantity = 0, IsActive = false
            }
        };

        public IReadOnlyList<Product> GetAll()
        {
            return _products;
        }

        public Product? GetById(int id)
        {
            return _products.FirstOrDefault(product => product.Id == id);
        }
        public Product Add(ProductRequestDTO request)
        {
            int newId = _products.Count == 0
                ? 1
                : _products.Max(product => product.Id) + 1;

            var product = new Product
            {
                Id = newId,
                Name = request.Name.Trim(),
                Category = request.Category.Trim(),
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                IsActive = request.IsActive
            };

            _products.Add(product);
            return product;
        }
        public Product? Update(int id, ProductRequestDTO request)
        {
            Product? product = GetById(id);

            if (product is null)
            {
                return null;
            }

            product.Name = request.Name.Trim();
            product.Category = request.Category.Trim();
            product.Price = request.Price;
            product.StockQuantity = request.StockQuantity;
            product.IsActive = request.IsActive;

            return product;
        }

        public bool Delete(int id)
        {
            Product? product = GetById(id);

            if (product is null)
            {
                return false;
            }

            return _products.Remove(product);
        }

    }
}
