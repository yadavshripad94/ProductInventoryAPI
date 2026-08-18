import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductRequest } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductStore } from '../../services/product-store.service';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule,RouterLink,DecimalPipe],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})

export class AddProduct {

  // ProductService is responsible for communicating
  // with the ASP.NET Core Web API.
  private readonly productService = inject(ProductService);

  // ProductStore contains the shared products Signal.
  // After successfully creating a product,
  // we add the new product to the shared products state.
  private readonly store = inject(ProductStore);

  // Router is used for programmatic navigation.
  // After successfully creating a product, we navigate back to the Products page.
  private readonly router = inject(Router);

  // FormBuilder helps us create the Reactive Form and its form controls.
  private readonly formBuilder = inject(FormBuilder);

  // Reactive Form
  // =========================================================
  // Reactive Forms is responsible for:
  // - storing form field values
  // - tracking form validity
  // - applying validation rules
  productForm = this.formBuilder.nonNullable.group({

    // Product name is required.
    productName: ['', Validators.required],

    // Default category is Electronics.
    // The category field is required.
    category: ['Electronics', Validators.required],

    // Price must be entered and must be at least 0.01.
    price: [0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],

    // Stock quantity is required.
    // Negative stock is not allowed.
    stockQuantity: [0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    // New products are active by default.
    isActive: [true]
  });

  // Writable Signal: Saving State
  // =========================================================
  // isSaving represents UI state, not form data.
  //    false -> no save operation is running
  //    true  -> the POST request is currently running
  //
  // This is a meaningful use of a Signal because the template reacts to this state.
  // For example, the Save button can be disabled and its text can change to "Saving...".
  isSaving = signal(false);

  // Writable Signal: Error Message
  // =========================================================
  // errorMessage stores an API-related error message.
  // Angular updates the corresponding UI automatically.
  errorMessage = signal('');

  // Save Product
  // =========================================================
  save(): void {

    // Reactive Forms already knows whether the form is valid or invalid.
    // We also prevent another save operation while one is already running.
    if (this.productForm.invalid || this.isSaving()) {
      return;
    }

    // Read the latest values from all controls in the Reactive Form.
    const formValue = this.productForm.getRawValue();

    // Convert the form values into the ProductRequest object expected by our Web API.
    const request: ProductRequest = {

      // Remove unwanted spaces from the beginning and end of the product name.
      name: formValue.productName.trim(),

      // Remove unwanted spaces from the category.
      category: formValue.category.trim(),

      price: formValue.price,

      stockQuantity: formValue.stockQuantity,

      isActive: formValue.isActive
    };

    // Update Signal State Before API Call
    // =======================================================
    // We know the exact new value should be true, so we use set().
    // This tells the UI that a save operation is currently in progress.
    this.isSaving.set(true);

    // Clear any previous API error message before starting a new request.
    this.errorMessage.set('');

    // Call the Web API
    // ProductService sends a POST request to create the new product.
    // HttpClient returns an Observable, so we subscribe to receive the response.
    this.productService
      .createProduct(request)
      .subscribe({

        // Success
        next: product => {

          // The API returns the newly created Product.
          // Add it to the shared products Signal inside ProductStore.

          // When the shared products Signal changes, other components and computed Signals that
          // depend on products() can automatically work with the latest product list.
          this.store.addProduct(product);

          // Navigate back to the Products page.
          this.router.navigate([
            '/products'
          ]);
        },

        // Error
        error: () => {

          // Store the error message inside the errorMessage Signal.
          // If the template reads errorMessage(),
          // Angular automatically displays the latest value.
          this.errorMessage.set(
            'Unable to create the product.'
          );

          // The save operation has finished, so reset isSaving to false.
          // The UI can now enable the Save button again.
          this.isSaving.set(false);
        }
      });
  }
}
