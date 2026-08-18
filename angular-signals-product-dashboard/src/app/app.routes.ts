import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { ProductList } from './pages/product-list/product-list';
import { AddProduct } from './pages/add-product/add-product';
import { EditProduct } from './pages/edit-product/edit-product';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'products', component: ProductList },
  { path: 'products/add', component: AddProduct },
  { path: 'products/edit/:id', component: EditProduct },
  { path: '**', component: NotFound }


];
