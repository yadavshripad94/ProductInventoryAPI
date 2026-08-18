import { Injectable, inject, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

@Injectable({
  // providedIn: 'root' creates one shared instance of ProductStore
  // for the entire Angular application.
  //
  // This is important because multiple routed components such as
  // Dashboard, Product List, Add Product, Edit Product, and Order can work with the same Signal state.
  providedIn: 'root'
})
export class ProductStore {
  // Inject ProductService.
  // ProductService is responsible for communicating with the ASP.NET Core Web API using HttpClient.
  private readonly productService = inject(ProductService);

  // Shared Signal State
  // Stores the complete product collection returned by the API.
  // This is a writable Signal because the product collection
  // can change when products are loaded, added, updated, or deleted.
  // Initial value is an empty array.
  products = signal<Product[]>([]);

  // Stores whether an API request is currently loading products.
  // Components can read isLoading() and reactively display or hide loading messages.
  isLoading = signal(false);

  // Stores the current error message.
  // If the API request fails, we update this Signal.
  // Any component reading errorMessage() will automatically receive the latest value.
  errorMessage = signal('');

  // Tracks whether products have already been loaded successfully.
  // This helps us avoid making the same GET request every time the user navigates between routed pages.
  hasLoaded = signal(false);

  // Load Products
  loadProducts(force = false): void {

    // Read the current hasLoaded Signal value.
    // If products have already been loaded and force is false, we do not call the API again.
    if (this.hasLoaded() && !force) {
      return;
    }

    // We know the exact new values, so set() is appropriate here.
    this.isLoading.set(true);
    this.errorMessage.set('');

    // HttpClient returns an Observable.
    this.productService.getProducts().subscribe({

      next: products => {
        // The API returned the complete product collection.
        // Therefore, set() replaces the current Signal value
        // with the new array returned by the server.
        this.products.set(products);

        // Mark the data as successfully loaded.
        this.hasLoaded.set(true);

        // Loading is complete.
        this.isLoading.set(false);
      },

      error: () => {
        // Store the error message in a Signal.
        // Components that read errorMessage() can reactively display this message.
        this.errorMessage.set(
          'Unable to load products. Make sure the Web API is running.'
        );

        // The API request has finished, even though it failed.
        this.isLoading.set(false);
      }
    });
  }

  // Add Product to Signal State
  addProduct(product: Product): void {
    // We use update() because the new products array depends on the existing products array.
    // currentProducts contains the current Signal value.
    // We create a new array containing:
    // 1. All existing products
    // 2. The newly created product
    this.products.update(currentProducts =>
      [...currentProducts, product]
    );
  }

  // Replace an Existing Product
  replaceProduct(updatedProduct: Product): void {
    // Again, the new array depends on the current array, so update() is appropriate.
    this.products.update(currentProducts =>

      // map() creates a new array.
      currentProducts.map(product =>

        // Find the product that was updated.
        product.id === updatedProduct.id

          // Replace it with the latest product returned by the Web API.
          ? updatedProduct

          // Keep every other product unchanged.
          : product
      )
    );
  }

  // Remove Product from Signal State
  removeProduct(id: number): void {
    // The new array depends on the current array, therefore we use update().
    this.products.update(currentProducts =>

      // filter() creates a new array containing all products
      // except the product whose id matches the deleted id.
      currentProducts.filter(
        product =>product.id !== id
      )
    );
  }

  // Clear Error
  clearError(): void {
    // We already know the exact new value, therefore set() is used.
    this.errorMessage.set('');
  }

  // Set Error Message
  setError(message: string): void {
    // Replace the current error message with the supplied message.
    this.errorMessage.set(message);
  }
}
