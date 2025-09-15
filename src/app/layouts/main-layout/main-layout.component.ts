import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderModule } from '../../components/header/header.module';
import { MenuModule } from '../../components/menu/menu.module';
import { DrawerModule } from 'primeng/drawer';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderModule, MenuModule, DrawerModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {

    screenWidth!: number;
    isMobile!: boolean;
    visible: boolean = false;

     ngOnInit() {
      // Executa o método no início para definir o estado inicial
      this.checkScreenWidth(window.innerWidth);
      console.log(this.isMobile);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?: any) {
      this.checkScreenWidth(event.target.innerWidth);
    }

    private checkScreenWidth(width: number): void {
      this.screenWidth = width;
      this.isMobile = this.screenWidth < 768;
    }
}
