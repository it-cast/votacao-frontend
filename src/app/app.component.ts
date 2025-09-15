import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'grc-frontend';

  constructor(
    private primeng: PrimeNG,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.primeng.ripple.set(true);
    // this.authService.loadUserCredentials();
  }
}
