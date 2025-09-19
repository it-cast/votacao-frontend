import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService, LazyLoadEvent ,ConfirmationService, MenuItem} from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { PhonePipe } from '../../pipes/phone.pipe';


import { CamaraService } from './camara.service'; 

import { Camara } from './camara.model'; 
import { HeaderButton } from '../../components/page-header/page-header.model';

import { PageHeaderComponent } from '../../components/page-header/page-header.component';


@Component({
  selector: 'app-camara',
  standalone: true, 
  imports: [TableModule,PhonePipe, FormsModule,ConfirmDialogModule, PageHeaderComponent, CommonModule, ButtonModule, CardModule, BreadcrumbModule, InputTextModule, PaginatorModule, TooltipModule, ToastModule],
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

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  constructor(
    public router: Router,
    private camaraService: CamaraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Início', routerLink: '/' },
      { label: 'Câmaras' }
    ];

    this.headerButtons = [
      { label: 'Adicionar', icon: 'fa-solid fa-plus', link: '/camara/adicionar' }
    ]

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

  deleteCamara(event: Event, camaraId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Alerta',
      message: 'Você tem certeza de que deseja excluir este registro?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmar',
        severity: 'danger',
      },

      accept: () => {
        return this.camaraService.deleteCamara(camaraId).subscribe(
          (response: any) => {
            //-- Removendo o usuário da lista
            const index = this.camaras.findIndex((s: any) => s.id === camaraId);
            if (index !== -1) this.camaras.splice(index, 1);
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Registro deletado com sucesso.' });
          }, (error) => {
            this.messageService.add({ severity: 'error', summary: 'Alerta', detail: error.error });
          }
        );
      },
      reject: () => {
        console.log('reject')
      },
    });
  }

}

    
