import { Component, Input , Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: false,
})
export class HeaderComponent implements OnInit {
  items: any = [];
  user: any = [];
  

  @Input() visible: boolean = false;
  @Input() isMobile: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuService: MenuService
  ) {
    this.user = this.authService.getUser();
    this.items = [
      {
        label: 'Perfil',
        items: [
          {
            label: 'Meus dados',
            command: () => this.router.navigate(['/usuario/editar/' + this.user.id])
          },
          // {
          //   label: 'Configurações',
          // },
          {
            separator: true
          },
          {
            label: 'Sair',
            command: () => {
              this.logout();
            }
          }
        ]
      }
    ];
  }

  ngOnInit(): void {
    console.log(this.visible);
    console.log(this.isMobile);
    
  }
  //-- Roger 16-06-2026
  //-- Desloga o usuário do sistema
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  //-- Adriano 11-07-2025
  //-- Este método será chamado pelo clique do botão no HTML
  toggleMenu() {
    if(!this.isMobile){
      this.menuService.toggleMenu();
    }else{
      this.visibleChange.emit(!this.visible);
    }
  }

}
