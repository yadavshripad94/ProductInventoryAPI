import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product, ProductRequest} from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductStore } from '../../services/product-store.service';


@Component({
  selector: 'app-product-list',
  imports: [FormsModule,CurrencyPipe,RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {

// Shared product state.
  readonly store = inject(ProductStore);

  // Used for HTTP operations.
  private readonly productService = inject(ProductService);

  // Local Writable Signals
  // =========================================================
  // Search text is local reactive state.
  // We keep this as a Signal because filteredProducts() depends on it.
  searchText = signal('');

  // Selected category is also local reactive state.
  // filteredProducts() also depends on this Signal.
  selectedCategory = signal('All');

  // Computed Signal: Categories
  // =========================================================
  // categories is derived completely from the shared products Signal.
  categories = computed(() => {
    const uniqueCategories = new Set(
      this.store.products().map(
        product =>product.category
      )
    );

    return [
      'All',
      ...uniqueCategories
    ];
  });

  // Computed Signal: Filtered Products
  // =========================================================
  // filteredProducts depends on:
  // 1. store.products()
  // 2. searchText()
  // 3. selectedCategory()
  // If any of these changes, the filtered result can automatically reflect the latest state.
  filteredProducts = computed(() => {

    const search = this.searchText().trim().toLowerCase();
    const category = this.selectedCategory();

    return this.store.products().filter(

      product => {

        const matchesSearch = product.name.toLowerCase().includes(search);
        const matchesCategory = category === 'All' || product.category === category;

        return ( matchesSearch&&matchesCategory);
      }
    );
  });

  // Initialization
  // =========================================================
  ngOnInit(): void {
    // Load products into the shared products Signal.
    this.store.loadProducts();
  }

  // Search Change
  // =========================================================
  onSearchChange(value: string): void {
    // We know the exact new value, so set() is appropriate.
    this.searchText.set(value);
  }

  // Category Change
  // =========================================================
  onCategoryChange(value: string): void {
    // We know the exact new value, so set() is appropriate.
    this.selectedCategory.set(value);
  }

  // Refresh Products
  // =========================================================
  refresh(): void {
    // true forces the Web API to be called again.
    this.store.loadProducts(true);
  }

  // Restock Product
  // =========================================================
  restockProduct(product: Product): void {
    const request: ProductRequest = {
      name: product.name,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity + 5,
      isActive: product.isActive
    };

    this.store.clearError();

    this.productService
      .updateProduct(
        product.id,
        request
      )
      .subscribe({

        next: updatedProduct => {
          // Updates the shared products Signal.
          // Since categories() and filteredProducts() depend on products(), 
          // they can automatically reflect the updated data.
          this.store.replaceProduct(
            updatedProduct
          );
        },

        error: () => {
          this.store.setError(
            'Unable to restock the product.'
          );
        }
      });
  }

  // Delete Product
  // =========================================================
  deleteProduct(product: Product): void {

    const shouldDelete = confirm(`Delete ${product.name}?`);
    if (!shouldDelete) {
      return;
    }

    this.store.clearError();

    this.productService
      .deleteProduct(product.id)
      .subscribe({

        next: () => {
          // Removes the product from the shared products Signal.
          this.store.removeProduct( product.id);
        },

        error: () => {
          this.store.setError(
            'Unable to delete the product.'
          );
        }
      });
  }
}

