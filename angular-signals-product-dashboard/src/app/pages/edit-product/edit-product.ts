import { Component, OnInit, inject, signal} from '@angular/core';
import { FormBuilder,  ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductRequest } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductStore } from '../../services/product-store.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,DecimalPipe],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})

export class EditProduct implements OnInit {

 
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly store = inject(ProductStore);
  private readonly formBuilder = inject(FormBuilder);

  productId: number | null = null;

  productForm = this.formBuilder.nonNullable.group({
    productName: ['', Validators.required],
    category: ['', Validators.required],

    price: [0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],

    stockQuantity: [0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    isActive: [true]
  });


  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    const idValue = this.route.snapshot.paramMap.get('id');
    const id = Number(idValue);

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage.set(
        'Invalid product id.'
      );

      return;
    }


    this.productId = id;
    this.loadProduct(id);
  }


  private loadProduct(id: number): void {

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.productService
      .getProductById(id)
      .subscribe({

        next: product => {
  
          this.productForm.patchValue({
            productName: product.name,
            category: product.category,
            price: product.price,
            stockQuantity: product.stockQuantity,
            isActive: product.isActive
          });
      
          this.isLoading.set(false);
        },

        error: () => {
          this.errorMessage.set(
            'Unable to load the product.'
          );

          this.isLoading.set(false);
        }
      });
  }

  save(): void {

    if (this.productId === null) {
      return;
    }

    if (this.productForm.invalid || this.isSaving()) {
      return;
    }

    const formValue = this.productForm.getRawValue();

    const request: ProductRequest = {
      name: formValue.productName.trim(),
      category: formValue.category.trim(),
      price: formValue.price,
      stockQuantity: formValue.stockQuantity,
      isActive: formValue.isActive
    };

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.productService
      .updateProduct(
        this.productId,
        request
      )
      .subscribe({

        next: updatedProduct => {
 
          this.store.replaceProduct(
            updatedProduct
          );

          this.router.navigate(['/products']);
        },

        error: () => {

          this.errorMessage.set(
            'Unable to update the product.'
          );

          this.isSaving.set(false);
        }
      });
  }
}
