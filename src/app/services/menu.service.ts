import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  //-- BehaviorSubject guarda o último valor e o emite para novos inscritos.
  //-- Começa com 'true' (menu visível em telas grandes).
  private menuVisible = new BehaviorSubject<boolean>(true);

  //-- Adriano 11-07-2025
  //-- Expõe o estado como um Observable (somente leitura)
  isMenuVisible$ = this.menuVisible.asObservable();

  constructor() { }

  //-- Adriano 11-07-2025
  //-- Método para alternar a visibilidade do menu
  toggleMenu() {
    console.log('toggleMenu');
    this.menuVisible.next(!this.menuVisible.value);
  }

  //-- Adriano 11-07-2025
  //-- Método para esconder o menu (útil para navegação em telas pequenas)
  hideMenu() {
    this.menuVisible.next(false);
  }
}