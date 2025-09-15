import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // AJUSTE: Trocamos a verificação da propriedade pelo método isLoggedIn()
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/']); // Redireciona para a página de login
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Acesso Negado', 
                detail: 'Realize o login para continuar!' 
            });
            return false;
        }

        return true;
    }
}