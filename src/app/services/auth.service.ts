// auth.service.ts
import { Injectable } from '@angular/core';

// Interface para tipar os dados do usuário que vêm da API
export interface User {
  id: number;
  email: string;
  nome: string;
  ativo: boolean;
  is_superuser: boolean;
}

// Interface para tipar a resposta completa do endpoint de login
export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'userData';

  constructor() { }

  /**
   * Adriano 10-09-2025
   * Salva os dados de login (token e usuário) no localStorage
   * e atualiza o estado de autenticação.
   * @param data A resposta do endpoint de login.
   */
  storeLoginData(data: LoginResponse): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, data.access_token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.usuario));
    }
  }

  /**
   * Adriano 10-09-2025
   * Remove as credenciais do usuário do localStorage e efetua o logout.
   */
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Adriano 10-09-2025
   * Verifica se o usuário está logado checando a existência do token.
   * @returns `true` se o token existir, `false` caso contrário.
   */
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem(this.TOKEN_KEY);
    }
    return false;
  }

  /**
   * Adriano 10-09-2025
   * Retorna o token de acesso (JWT) armazenado.
   * @returns O token como string ou null se não existir.
   */
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Adriano 10-09-2025
   * Retorna os dados do usuário logado.
   * @returns O objeto do usuário ou null se não estiver logado.
   */
  getUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}