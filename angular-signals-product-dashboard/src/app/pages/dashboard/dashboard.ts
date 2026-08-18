import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductStore } from '../../services/product-store.service';


@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
// Inject the ProductStore.
  // ProductStore contains the shared products Signal.
  // The products loaded from the Web API are stored inside:
  // products = signal<Product[]>([]);
  readonly store = inject(ProductStore);

  // Computed Signal: Total Number of Products
  // totalProducts is a computed Signal.
  // It depends on store.products().

  // Whenever the products Signal changes because a product is added, deleted, or loaded again, 
  // this value is derived automatically from the latest product array.
  totalProducts = computed(() =>
    this.store.products().length
  );

  // Computed Signal: Number of Active Products
  // activeProducts is also derived from the products Signal.
  // We filter the current product collection and count only products whose isActive value is true.
  // If any product is added, removed, or its active status changes,
  // this computed Signal automatically reflects the latest result.
  activeProducts = computed(() =>
    this.store.products().filter(
      product =>product.isActive
    ).length
  );

  // Computed Signal: Number of Low-Stock Products
  // A product is considered low stock when its available quantity is 5 or less.
  // lowStockProducts depends completely on products().
  // For example, if a product has stock 4 and we restock it to 9, the products Signal changes.
  lowStockProducts = computed(() =>
    this.store.products().filter(
      product =>product.stockQuantity<= 5
    ).length
  );

  // Computed Signal: Total Units Available in Inventory
  // totalStock calculates the sum of StockQuantity for all products.
  // Example:
  // Laptop Stock = 8
  // Mouse Stock = 25
  // Chair Stock = 4
  // Total Stock = 37
  //
  // Since this value is completely derived from products(), it should be a computed Signal.
  totalStock = computed(() =>
    this.store.products().reduce(
      //Initially: sum = 0
      (sum, product) =>
        sum + product.stockQuantity,
      0 
    )
  );

  // Computed Signal: Total Inventory Value
  // inventoryValue calculates the total monetary value of all products currently available in inventory.

  // For each product:
  // Inventory Value = Price × Stock Quantity
  // Then all product values are added together.

  // This computed Signal depends on products().
  // Therefore, if a product is added, deleted, restocked, or its price changes, 
  // the inventory value is derived automatically from the latest product data.
  inventoryValue = computed(() =>
    this.store.products().reduce(
      (sum, product) =>
        sum + product.price * product.stockQuantity,
      0
    )
  );

  // Component Initialization
  ngOnInit(): void {

    // Ask ProductStore to load products from the Web API.
    // ProductStore uses HttpClient to call the backend.

    // Once the products Signal changes, all computed Signals
    // above automatically derive their latest values:
    this.store.loadProducts();
  }
}

