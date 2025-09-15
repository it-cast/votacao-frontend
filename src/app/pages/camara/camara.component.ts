import { Component, OnInit } from '@angular/core';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PhonePipe } from '../../pipes/phone.pipe';


import { Camara } from './camara.model'; 
import { CamaraService } from './camara.service'; 

@Component({
  selector: 'app-camara',
  standalone: true, 
  imports: [TableModule,PhonePipe, FormsModule, RouterLink, CommonModule, ButtonModule, CardModule, BreadcrumbModule, InputTextModule, PaginatorModule, TooltipModule, ToastModule],
  providers: [MessageService], 
  templateUrl: './camara.component.html',
  styleUrl: './camara.component.scss'
})
export class CamaraComponent implements OnInit {
  
  isLoading                   : boolean   = false; 
  camaras                     : Camara[]  = [];
  totalRecords                : number    = 0;
  rows                        : number    = 10; 
  first                       : number    = 0;
  
  private ultimoLazyLoadEvent : LazyLoadEvent = { first: 0, rows: this.rows };
  formFiltro                  : any = { filtro: ''}

  constructor(
    public router: Router,
    private camaraService: CamaraService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
    this.loadCamaras(eventoInicial);
  }

  /**
   * Adriano 10-09-2025
   * Carregar as camaras paginadas
   * @param event O evento emitido pela tabela PrimeNG
   */
  loadCamaras(event: LazyLoadEvent): void {
    this.isLoading = true;

    this.ultimoLazyLoadEvent = event;
    this.first = event.first ?? 0;
    const limit = event.rows ?? this.rows;

    this.carregarCamaras(this.first, limit, this.formFiltro.filtro);
  }


  /**
   * Adriano 10-09-2025
   * Função que faz a requisição e retornar as camaras paginadas
   * @param skip 
   * @param limit 
   * @param filtro
  */
  carregarCamaras(skip: number, limit: number, filtro?: string){
     this.camaraService.getCamaras(skip, limit, filtro).subscribe({
      next: (response: any) => {
        this.camaras = response.items;
        this.totalRecords = response.total;
        
        this.isLoading = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar câmaras:', erro);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Não foi possível carregar os dados das câmaras.' 
        });
        this.isLoading = false;
      }
    });
  }

  /**
   * Acionado ao clicar no botão de filtro.
   * Reseta a paginação para a primeira página e carrega os dados com o filtro.
  */
  filtrarLista(){
    const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
    this.loadCamaras(eventoInicial);
    
  }

}

    
