import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { Toolbar } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { SplitButtonModule } from 'primeng/splitbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule as PrimeMenu } from 'primeng/menu';

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [
    CommonModule,
    Toolbar, 
    AvatarModule, 
    ButtonModule,
    ToastModule,
    SplitButtonModule,
    OverlayPanelModule,
    PrimeMenu
  ]
})
export class HeaderModule { }
