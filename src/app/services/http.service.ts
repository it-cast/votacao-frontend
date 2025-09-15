// http.service.ts
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError } from 'rxjs';

// URL base da sua API
export const apiUrl = 'http://127.0.0.1:8000/api/v1/';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Adriano 10-09-2025
   * Cria os cabeçalhos de autenticação para as requisições.
   * @returns um objeto HttpHeaders com o token de autorização.
   */
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
  
  /**
   * Adriano 10-09-2025
   * Faz uma requisição GET para a API.
   * @param urlAction O endpoint da API (ex: 'camaras').
   * @param queryParams Parâmetros de URL opcionais.
   */
  get(urlAction: string, queryParams?: HttpParams): Observable<any> {
    const options = {
      headers: this.getAuthHeaders(),
      params: queryParams
    };
    return this.http.get(apiUrl + urlAction, options).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Adriano 10-09-2025
   * Faz uma requisição POST para a API.
   * @param urlAction O endpoint da API.
   * @param data O corpo da requisição.
   */
  post(urlAction: string, data: any): Observable<any> {
    return this.http.post(apiUrl + urlAction, JSON.stringify(data), { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Adriano 10-09-2025
   * Faz uma requisição PUT para a API.
   * @param urlAction O endpoint da API.
   * @param data O corpo da requisição.
   */
  put(urlAction: string, data: any): Observable<any> {
    return this.http.put(apiUrl + urlAction, JSON.stringify(data), { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Adriano 10-09-2025
   * Faz uma requisição PATCH para a API.
   * @param urlAction O endpoint da API.
   * @param data O corpo da requisição.
   */
  patch(urlAction: string, data: any): Observable<any> {
    return this.http.patch(apiUrl + urlAction, JSON.stringify(data), { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Adriano 10-09-2025
   * Faz uma requisição DELETE para a API.
   * @param urlAction O endpoint da API.
   */
  delete(urlAction: string): Observable<any> {
    return this.http.delete(apiUrl + urlAction, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Adriano 10-09-2025
   * Manipulador de erros genérico.
   */
  // --- FUNÇÃO CORRIGIDA ---
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocorreu um erro na requisição:', error);
    // Repassa o objeto de erro original (HttpErrorResponse) em vez de criar um novo.
    // Isso preserva todos os detalhes do erro para o componente que fez a chamada.
    return throwError(() => error);
  }
}