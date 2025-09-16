// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// -- Interfaces para tipar os dados --
export interface User {
  id: number;
  email: string;
  nome: string;
  ativo: boolean;
  is_superuser: boolean;
}

export interface Camara {
  id: number;
  nome: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario: User;
  camaras: Camara[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'userData';
  private readonly CAMARAS_KEY = 'camarasData';
  private readonly SELECTED_CAMARA_KEY = 'selectedCamara';

  // 1. Um "anunciador" (Subject) de eventos de autenticação
  public authStateChanged = new Subject<void>();

  // 2. Remova o MenuService do construtor para quebrar o ciclo
  constructor() { }

  storeLoginData(data: LoginResponse): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, data.access_token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.usuario));
      localStorage.setItem(this.CAMARAS_KEY, JSON.stringify(data.camaras || []));
      // Limpa a câmara selecionada anteriormente para forçar uma nova seleção se necessário
      localStorage.removeItem(this.SELECTED_CAMARA_KEY);
      
      // 3. Anuncie que o estado de autenticação mudou
      this.authStateChanged.next();
    }
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.CAMARAS_KEY);
      localStorage.removeItem(this.SELECTED_CAMARA_KEY);
      
      // 3. Anuncie que o estado de autenticação mudou
      this.authStateChanged.next();
    }
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem(this.TOKEN_KEY);
    }
    return false;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  getCamaras(): Camara[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const camaras = localStorage.getItem(this.CAMARAS_KEY);
      return camaras ? JSON.parse(camaras) : [];
    }
    return [];
  }

  storeSelectedCamara(camara: Camara): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.SELECTED_CAMARA_KEY, JSON.stringify(camara));
      // 3. Anuncie que o estado de autenticação mudou
      this.authStateChanged.next();
    }
  }

  getSelectedCamara(): Camara | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const camara = localStorage.getItem(this.SELECTED_CAMARA_KEY);
      return camara ? JSON.parse(camara) : null;
    }
    return null;
  }
}