import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-site-layout',
  imports: [ButtonModule, RouterOutlet],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.scss'
})
export class SiteLayoutComponent {

  constructor(public router: Router) { }

  year: number = new Date().getFullYear()
  menuAberto: boolean = false;

  //-- Roger 15-07-2025
  //-- Abrir facebook
  openFacebook() {
    window.open('https://www.facebook.com/people/GRC-Monitoramentos/100041394867054/#')
  }

  //-- Roger 15-07-2025
  //-- Abrir instagram
  openInstagram() {
    window.open('https://www.instagram.com/grcmonitoramentos/')
  }

}
