import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../../services/menu.service';


@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
    standalone: false, 
})
export class MenuComponent implements OnInit {
    isMenuVisible$: Observable<boolean>;

    items: any;
    user: any = null;

    @Input() visible: boolean = false;
    @Input() isMobile: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    constructor(
        private authService: AuthService,
        public router: Router,
        private menuService: MenuService,
        // O PermissionService foi removido daqui para não causar erro
    ) { 
        this.isMenuVisible$ = this.menuService.isMenuVisible$;
    }

    ngOnInit() {
        this.user = this.authService.getUser();
        this.items = [
            {
                label: 'Dashboard',
                icon: 'fa-solid fa-chart-line', // Ícone mais apropriado
                link: '/dashboard',
                permission: 'manage_dashboard' // A propriedade pode continuar aqui para uso futuro
            },
            {
                label: 'Câmaras',
                icon: 'fa-solid fa-building-columns', // Ícone mais apropriado
                link: '/camara',
                permission: 'manage_camaras' // A propriedade pode continuar aqui para uso futuro
            },
            {
                label: 'Usuários',
                icon: 'fa-solid fa-users', // Ícone mais apropriado
                link: '/usuario',
                permission: 'manage_usuarios' // A propriedade pode continuar aqui para uso futuro
            }
        ];
    }

    isSubItemActive(subItems: any[]): boolean {
        return subItems?.some(subItem => '/' + (this.router.url).split('/')[1] == subItem.link);
    }

    navegacao(link: string) {
        this.router.navigate([link]);

        if (this.isMobile) {
            this.visible = false;
            this.visibleChange.emit(this.visible);
        }
    }
    
    getClass(item:any) {
        const currentBaseRoute = '/' + this.router.url.split('/')[1];
        const isActive = currentBaseRoute === item.link;

        return isActive 
            ? 'block rounded-lg px-4 py-2 text-sm font-medium item-active cursor-pointer' 
            : 'cursor-pointer block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700';
    }
}

