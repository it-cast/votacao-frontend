import { Component, Input } from '@angular/core';

import { RouterLink } from '@angular/router';

// Imports do PrimeNG que o componente utiliza
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

import { HeaderButton } from './page-header.model';

@Component({
  selector: 'app-page-header',
  imports: [BreadcrumbModule,ButtonModule,RouterLink],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
   @Input() breadcrumbItems: MenuItem[] = [];
   @Input() buttons: HeaderButton[]     = [];
} 
