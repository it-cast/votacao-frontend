// src/app/services/menu.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService, User, Camara } from './auth.service';
import { AppMenuItem } from '../constants/menu.constants'; // A interface continua no local original

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Estado de visibilidade do menu
  private menuVisible = new BehaviorSubject<boolean>(true);
  isMenuVisible$ = this.menuVisible.asObservable();

  // BehaviorSubject para os itens do menu, que agora são controlados internamente
  private menuItemsSource = new BehaviorSubject<AppMenuItem[]>([]);
  public menuItems$: Observable<AppMenuItem[]> = this.menuItemsSource.asObservable();

  // --- Constantes de Menu movidas para dentro do serviço ---
  private readonly SUPERUSER_MENU_ITEMS: AppMenuItem[] = [
    { label: 'Dashboard', icon: 'fa-solid fa-chart-line', link: '/dashboard' },
    { label: 'Câmaras', icon: 'fa-solid fa-building-columns', link: '/camara' },
    { label: 'Usuários', icon: 'fa-solid fa-users', link: '/usuario' },
  ];

  constructor(private authService: AuthService) {
    // Atualiza o menu sempre que o estado de autenticação mudar
    this.authService.authStateChanged.subscribe(() => {
      this.updateMenuItems();
    });

    // Gera o menu inicial ao carregar o serviço
    this.updateMenuItems();
  }

  toggleMenu(): void {
    this.menuVisible.next(!this.menuVisible.value);
  }

  hideMenu(): void {
    this.menuVisible.next(false);
  }

  /**
   * Pega os dados mais recentes do AuthService, reconstrói o menu
   * e emite a nova lista de itens para quem estiver ouvindo (o menu component).
   */
  public updateMenuItems(): void {
    const user = this.authService.getUser();
    const camaras = this.authService.getCamaras();
    const selectedCamara = this.authService.getSelectedCamara();

    // Chama a função interna para gerar os itens do menu
    const newMenuItems = this.generateMenuItems(user, camaras, selectedCamara);
    
    // Emite o novo menu para os assinantes
    this.menuItemsSource.next(newMenuItems);
  }

  /**
   * Lógica de geração do menu que agora reside DENTRO do serviço.
   * Isso permite a criação de links dinâmicos com base nos dados de autenticação.
   * @param user O objeto do utilizador logado.
   * @param camaras A lista de câmaras a que o utilizador tem acesso.
   * @param selectedCamara A câmara atualmente selecionada (pode ser null).
   */
  private generateMenuItems(user: User | null, camaras: Camara[], selectedCamara: Camara | null): AppMenuItem[] {
    //-- Se não houver utilizador, retorna um menu vazio
    if (!user) {
      return [];
    }

    //-- Se for Super Admin, retorna o menu completo de admin
    if (user.is_superuser) {
      return this.SUPERUSER_MENU_ITEMS;
    }

    //-- Itens de menu base para utilizadores normais (agora definidos aqui para serem dinâmicos)
    const regularUserBaseMenu: AppMenuItem[] = [
        { label: 'Dashboard', icon: 'fa-solid fa-chart-line', link: '/dashboard' },
        { label: 'Usuários', icon: 'fa-solid fa-users', link: `/camara/usuarios/${selectedCamara?.id}` },
        { label: 'Mandatos', icon: 'fa-solid fa-calendar-check', link: '/mandato' },
        { label: 'Comissões', icon: 'fa-solid fa-users-gear', link: `/comissao`}

    ];

    //-- Utilizador com acesso a mais de uma câmara
    if (camaras.length > 1) {
      //-- Se ainda não selecionou uma câmara, mostra apenas o item "Acessos"
      if (!selectedCamara) {
        return [{ label: 'Acessos', icon: 'fa-solid fa-key', link: '/acesso' }];
      }
      //-- Se já selecionou, mostra "Acessos" mais o menu base
      else {
        return [
          { label: 'Acessos', icon: 'fa-solid fa-key', link: '/acesso' },
          ...regularUserBaseMenu
        ];
      }
    }
    
    //-- Utilizador com acesso a UMA câmara. O menu base é exibido diretamente.
    return regularUserBaseMenu;
  }
}
