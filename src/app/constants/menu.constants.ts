// menu.constants.ts
import { User, Camara } from '../services/auth.service';

export interface AppMenuItem {
  label: string;
  icon: string;
  link: string;
  permission?: string;
}

// Menu para Super Administradores (não muda)
const SUPERUSER_MENU_ITEMS: AppMenuItem[] = [
  { label: 'Dashboard', icon: 'fa-solid fa-chart-line', link: '/dashboard' },
  { label: 'Câmaras', icon: 'fa-solid fa-building-columns', link: '/camara' },
  { label: 'Usuários', icon: 'fa-solid fa-users', link: '/usuario' },
];

// Itens de menu base para utilizadores normais
const REGULAR_USER_BASE_MENU: AppMenuItem[] = [
    { label: 'Dashboard', icon: 'fa-solid fa-chart-line', link: '/dashboard' },
    { label: 'Mandatos', icon: 'fa-solid fa-calendar-check', link: '/mandato' }
];

/**
 * Gera o menu dinamicamente com base no perfil do utilizador e nas suas câmaras.
 * @param user O objeto do utilizador logado.
 * @param camaras A lista de câmaras a que o utilizador tem acesso.
 * @param selectedCamara A câmara atualmente selecionada (pode ser null).
 */
export function getMenuItems(user: User | null, camaras: Camara[], selectedCamara: Camara | null): AppMenuItem[] {
  //-- Se não houver utilizador, retorna um menu vazio
  if (!user) {
    return [];
  }

  //-- Se for Super Admin, retorna o menu completo de admin
  if (user.is_superuser) {
    return SUPERUSER_MENU_ITEMS;
  }

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
        ...REGULAR_USER_BASE_MENU
      ];
    }
  }
  
  //-- Utilizador com acesso a UMA ou NENHUMA câmara
  //-- Em ambos os casos, o menu base é exibido diretamente, sem a opção "Acessos".
  return REGULAR_USER_BASE_MENU;
}