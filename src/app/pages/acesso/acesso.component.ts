// votacao-frontend/src/app/pages/acesso/acesso.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe o CommonModule
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card'; // Para um visual mais limpo
import { ButtonModule } from 'primeng/button'; // Para os botões

import { AuthService, Camara } from '../../services/auth.service';
import { TableModule } from "primeng/table";
import { BreadcrumbModule } from "primeng/breadcrumb"; 

@Component({
  selector: 'app-acesso',
  // Adicione os módulos necessários ao imports
  imports: [CommonModule, CardModule, ButtonModule, TableModule, BreadcrumbModule],
  templateUrl: './acesso.component.html',
  styleUrl: './acesso.component.scss'
})
export class AcessoComponent implements OnInit {

  // Propriedade para guardar a lista de câmaras do utilizador
  camaras: Camara[] = [];
  selectedCamaraId: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ao iniciar o componente, busca as câmaras do localStorage
    this.camaras = this.authService.getCamaras() || [];

    const selectedCamara = this.authService.getSelectedCamara();
    if (selectedCamara) {
      this.selectedCamaraId = selectedCamara.id;
    }
  }

  /**
   * Chamado quando o utilizador clica para selecionar uma câmara.
   * @param camara O objeto da câmara selecionada.
   */
  selecionarCamara(camara: Camara): void {
    // 1. Guarda a câmara selecionada no localStorage através do AuthService
    this.authService.storeSelectedCamara(camara);

    // 2. Redireciona o utilizador para o dashboard
    this.router.navigate(['/dashboard']);
  }
}