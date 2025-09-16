// login.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { LoginService } from './login.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService, LoginResponse } from '../../services/auth.service';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ButtonModule, CheckboxModule,FloatLabelModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, CardModule, MessageModule, CommonModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formLogin: any = {
    login: '',
    password: '',
  }

  loadingButton: boolean = false;

  constructor(
    public router: Router,
    private loginService: LoginService,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loadingButton = true;
    this.loginService.authenticate(this.formLogin).subscribe({
      next: (response: LoginResponse) => {
        this.authService.storeLoginData(response);
        this.loadingButton = false;

        //-- Se for um Super Admin, vai sempre para o dashboard
        if (response.usuario.is_superuser) {
          this.router.navigate(['/dashboard']);
          return; // Termina a execução aqui
        }

        //-- Se for um utilizador normal, verifica o número de câmaras
        if (response.camaras && response.camaras.length === 1) {
          //-- Se tiver exatamente UMA câmara, seleciona-a automaticamente...
          this.authService.storeSelectedCamara(response.camaras[0]);
          this.router.navigate(['/dashboard']);
        } else {
          //-- Se tiver MAIS de uma câmara (ou nenhuma), vai para a página de seleção.
          this.router.navigate(['/acesso']);
        }
      },
      error: (error: any) => {
        this.loadingButton = false;
        // ATUALIZADO: Acessando a mensagem de detalhe específica do erro da API
        const detailMessage = error?.error?.detail || 'Não foi possível fazer o login. Verifique seus dados.';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: detailMessage });
      }
    });
  }
}