import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { UsuarioCamara} from './usuario-camara.model'
import { UsuarioCamaraService } from './usuario-camara.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from "primeng/badge";

@Component({
  selector: 'app-usuario-camara',
  imports: [ButtonModule, CardModule, TableModule, FormsModule, ConfirmDialogModule, BreadcrumbModule, InputTextModule, PaginatorModule, TooltipModule, ToastModule, BadgeModule],
  templateUrl: './usuario-camara.component.html',
  styleUrl: './usuario-camara.component.scss'
})
export class UsuarioCamaraComponent {
  isLoading       : boolean   = false;
  usuariosCamara  : UsuarioCamara[] = [];
  totalRecords    : number    = 0;
  rows            : number    = 10;
  first           : number    = 0;

  camaraId        : number    = 0;
  currentCamaraId: number | null = null;

  private ultimoLazyLoadEvent : LazyLoadEvent = { first: 0, rows: this.rows };
  formFiltro                  : any = { filtro: ''}

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private usuarioCamaraService: UsuarioCamaraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['camaraId'];
      if (id) {
        this.currentCamaraId = +id;
        const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
        this.loadUsuariosCamara(eventoInicial);
      }
    });
  }

  /**
  * Adriano 10-09-2025
  * Carregar os usuarios
  * @param event 
  */
  loadUsuariosCamara(event: LazyLoadEvent): void {
    this.isLoading = true;
    this.ultimoLazyLoadEvent = event;
    this.first = event.first ?? 0;
    const limit = event.rows ?? this.rows;
    this.carregarDados(this.first, limit, this.formFiltro.filtro);
  }


  /**
    * Adriano 10-09-2025
    * Carregar so dados de todos os usuarios paginados
    * @param skip 
    * @param limit 
    * @param filtro 
  */
  carregarDados(skip: number, limit: number, filtro?: string){
    this.usuarioCamaraService.getCamaraUsuarios(skip, limit, filtro, this.currentCamaraId).subscribe({
      next: (response: any) => {
        this.usuariosCamara = response.items;
        console.log(this.usuariosCamara);
        
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar usuários:', erro);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Não foi possível carregar os dados dos usuários.' 
        });
        this.isLoading = false;
      }

    })
  }

  /**
   * Adriano 10-09-2025
   * Acionado ao clicar no botão de filtro.
   * Reseta a paginação para a primeira página e carrega os dados com o filtro.
  */
  filtrarUsuarios(){
    const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
    this.loadUsuariosCamara(eventoInicial);
  }


  deleteUsuario(event: Event, usuarioId: number) {
    
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
        return this.usuarioCamaraService.deleteCamaraUsuario(usuarioId).subscribe(
          (response: any) => {
            //-- Removendo o usuário da lista
            const index = this.usuariosCamara.findIndex((s: any) => s.id === usuarioId);
            if (index !== -1) this.usuariosCamara.splice(index, 1);
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
