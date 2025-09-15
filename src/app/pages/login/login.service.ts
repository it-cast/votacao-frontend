// login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../../services/http.service';
import { LoginResponse } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient, // Usamos HttpClient diretamente para esta chamada específica
  ) { }

  /**
   * Envia a solicitação para autenticar o usuário.
   * @param form O objeto do formulário contendo login e password.
   * @returns Um Observable com a resposta do login (token e dados do usuário).
   */
  authenticate(form: any): Observable<LoginResponse> {
    // A API espera 'username' e 'password' no formato x-www-form-urlencoded.
    // Usamos HttpParams para que o Angular formate a requisição corretamente.
    const body = new HttpParams()
      .set('username', form.login) // O backend espera 'username', não 'login'
      .set('password', form.password);

    // O endpoint de login é 'login', conforme definido no auth_router.py.
    return this.http.post<LoginResponse>(apiUrl + 'login', body);
  }
}