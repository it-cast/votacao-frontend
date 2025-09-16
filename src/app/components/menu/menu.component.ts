// src/app/components/menu/menu.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../../services/menu.service';
import { AppMenuItem } from '../../constants/menu.constants';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
    standalone: false, 
})
export class MenuComponent implements OnInit {
    isMenuVisible$: Observable<boolean>;
    items$: Observable<AppMenuItem[]>;
    user: User | null = null;

    @Input() visible: boolean = false;
    @Input() isMobile: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    constructor(
        private authService: AuthService,
        public router: Router,
        private menuService: MenuService,
    ) { 
        this.isMenuVisible$ = this.menuService.isMenuVisible$;
        this.items$ = this.menuService.menuItems$;
    }

    ngOnInit() {
      // Opcional: Ainda podemos pegar o usuário para exibir o nome, etc.
      this.user = this.authService.getUser();
      // Ouve mudanças no estado de autenticação para atualizar o usuário, se necessário
      this.authService.authStateChanged.subscribe(() => {
        this.user = this.authService.getUser();
      });
    }

    navegacao(link: string) {
        this.router.navigate([link]);

        if (this.isMobile) {
            this.visible = false;
            this.visibleChange.emit(this.visible);
        }
    }
    
    getClass(item: AppMenuItem) {
        const currentBaseRoute = '/' + this.router.url.split('/')[1];
        const isActive = currentBaseRoute === item.link;

        return isActive 
            ? 'block rounded-lg px-4 py-2 text-sm font-medium item-active cursor-pointer' 
            : 'cursor-pointer block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700';
    }
}