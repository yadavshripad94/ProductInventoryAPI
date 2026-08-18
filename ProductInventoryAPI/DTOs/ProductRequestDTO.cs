using System.ComponentModel.DataAnnotations;

namespace ProductInventoryAPI.DTOs
{
    public class ProductRequestDTO
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        [Range(0.01, 10000000)]
        public decimal Price { get; set; }

        [Range(0, 100000)]
        public int StockQuantity { get; set; }

        public bool IsActive { get; set; } = true;

    }
}
