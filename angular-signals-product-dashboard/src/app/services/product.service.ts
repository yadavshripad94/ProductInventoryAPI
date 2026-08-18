import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductRequest } from '../models/product.model';

@Injectable({
  // providedIn: 'root' makes ProductService available
  // throughout the Angular application using dependency injection.
  providedIn: 'root'
})
export class ProductService {

  // Inject Angular HttpClient.
  // HttpClient is responsible for sending HTTP requests to the ASP.NET Core Web API.
  private readonly http = inject(HttpClient);

  // Base URL of the Products Web API.
  // Update the port number based on the URL used by your ASP.NET Core Web API.
  private readonly apiUrl = 'https://localhost:7215/api/products';

  // Get All Products
  getProducts(): Observable<Product[]> {
    // Sends:
    // GET https://localhost:7242/api/products
    // HttpClient returns an Observable.
    // When the API responds successfully,
    // the Observable emits an array of Product objects.
    // Emits means produces or sends a value to the subscriber
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Get Product by Id
  getProductById(id: number): Observable<Product> {
    // Sends:
    // GET https://localhost:7242/api/products/{id}
    // Example: GET https://localhost:7242/api/products/3
    // The returned Observable emits one Product object.
    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );
  }

  // Create Product
  createProduct(
    request: ProductRequest
  ): Observable<Product> {
    // Sends:
    // POST https://localhost:7242/api/products
    // The ProductRequest object is sent in the request body.
    // The Web API creates the product and returns the newly created Product object.
    return this.http.post<Product>(
      this.apiUrl,
      request
    );
  }

  // Update Product
  updateProduct(
    id: number,
    request: ProductRequest
  ): Observable<Product> {
    // Sends:
    // PUT https://localhost:7242/api/products/{id}
    // Example: PUT https://localhost:7242/api/products/3
    // The updated product data is sent through the ProductRequest object in the request body.
    // The API returns the updated Product object.
    return this.http.put<Product>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  // Delete Product
  deleteProduct(id: number): Observable<void> {
    // Sends:
    // DELETE https://localhost:7242/api/products/{id}
    // The API deletes the requested product.
    // Observable<void> means we do not expect
    // any response body after successful deletion.
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
