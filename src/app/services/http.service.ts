// http.service.ts
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';

// URL base da sua API
// export const apiUrl = 'http://127.0.0.1:8000/api/v1/';
export const apiUrl = 'http://localhost:8000/api/v1/'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  get(urlAction: string, queryParams?: HttpParams): Observable<any> {
    const options = {
      headers: this.getAuthHeaders(),
      params: queryParams
    };
    
    return this.http.get(apiUrl + urlAction, options).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  post(urlAction: string, data: any): Observable<any> {
    return this.http.post(apiUrl + urlAction, JSON.stringify(data), { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  put(urlAction: string, data: any): Observable<any> {
    return this.http.put(apiUrl + urlAction, JSON.stringify(data), { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  patch(urlAction: string, data: any): Observable<any> {
    return this.http.patch(apiUrl + urlAction, JSON.stringify(data), { headers: this.getAuthHeaders() }).pipe( 
      catchError(this.handleError.bind(this))
    );
  }

  delete(urlAction: string): Observable<any> {
    return this.http.delete(apiUrl + urlAction, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      console.log('Token expirado ou inválido. A deslogar...');
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Sessão Expirada', 
        detail: 'O seu acesso expirou. Por favor, faça login novamente.' 
      });
      this.authService.logout();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500); 
    }
    return throwError(() => error);
  }
}