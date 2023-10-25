import { Injectable } from '@angular/core';
import { Observable, catchError, elementAt, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from './classes/product';
import { ColorFilter } from './classes/colorFilter';
import { apiUrl } from './classes/constants';
import { Query } from './classes/query';
import { User } from './classes/user';
import { Cart } from './classes/cart';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  public getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(apiUrl + 'products')
      .pipe(catchError(this.handleError));
  }

  public getFilteredProducts(query: Query): Observable<Product[]> {
    return this.http
      .get<Product[]>(
        apiUrl +
          'products?colorId=' +
          query.colorId +
          '&brand=' +
          query.brand +
          '&availability=' +
          query.availability
      )
      .pipe(catchError(this.handleError));
  }

  getColors(): Observable<ColorFilter[]> {
    return this.http
      .get<ColorFilter[]>(apiUrl + 'colors')
      .pipe(catchError(this.handleError));
  }

  getProductDetail(id: number): Observable<Product> {
    return this.http
      .get<Product>(apiUrl + 'products/' + id)
      .pipe(catchError(this.handleError));
  }

  getBrands(): Observable<String[]> {
    return this.http
      .get<String[]>(apiUrl + 'brands')
      .pipe(catchError(this.handleError));
  }

  getUser(): Observable<User> {
    return this.http
      .get<User>(apiUrl + 'user')
      .pipe(catchError(this.handleError));
  }

  verifyIfCartProductsAreAvailable(products: any[]): Observable<any> {
    return this.http
      .post<any>(`${apiUrl}check-availability`, products)
      .pipe(catchError(this.handleError));
  }

  updateCreditAndProducts(
    cart: Cart
  ): Observable<{ user: User; products: Product[] }> {
    // Submit your cart to update your credit and get the new data
    return this.http.post<{ user: User; products: Product[] }>(
      `${apiUrl}update-credit`,
      cart
    );
  }

  constructor(private http: HttpClient) {}
}
