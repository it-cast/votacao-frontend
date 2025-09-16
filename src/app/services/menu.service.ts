// src/app/services/menu.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { getMenuItems, AppMenuItem } from '../constants/menu.constants';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Estado de visibilidade
  private menuVisible = new BehaviorSubject<boolean>(true);
  isMenuVisible$ = this.menuVisible.asObservable();

  // Estado dos itens do menu
  private menuItemsSource = new BehaviorSubject<AppMenuItem[]>([]);
  public menuItems$: Observable<AppMenuItem[]> = this.menuItemsSource.asObservable();

  constructor(private authService: AuthService) {
    this.updateMenuItems();

    // Subscreve aos eventos do AuthService.
    // Sempre que um evento for emitido, a função updateMenuItems() será chamada.
    this.authService.authStateChanged.subscribe(() => {
      console.log('Auth state changed, updating menu...'); // Para depuração
      this.updateMenuItems();
    });
  }

  toggleMenu(): void {
    this.menuVisible.next(!this.menuVisible.value);
  }

  hideMenu(): void {
    this.menuVisible.next(false);
  }

  /**
   * Pega os dados mais recentes do AuthService, reconstrói o menu
   * e emite a nova lista de itens.
   */
  public updateMenuItems(): void {
    const user = this.authService.getUser();
    const camaras = this.authService.getCamaras();
    const selectedCamara = this.authService.getSelectedCamara();

    const newMenuItems = getMenuItems(user, camaras, selectedCamara);
    
    this.menuItemsSource.next(newMenuItems);
  }
}