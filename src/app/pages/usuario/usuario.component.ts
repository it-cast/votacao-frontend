import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MessageService, LazyLoadEvent, MenuItem } from 'primeng/api';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from 'primeng/button';

import { UsuarioService } from './usuario.service';

import { Usuario } from './usuario.model';
import { HeaderButton } from '../../components/page-header/page-header.model'
import { ColumnDefinition, ActionDefinition } from '../../components/generic-list/generic-list.model';

import { PageHeaderComponent} from '../../components/page-header/page-header.component';
import { GenericListComponent } from '../../components/generic-list/generic-list.component';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, TableModule, PageHeaderComponent,GenericListComponent, ButtonModule, CardModule, BreadcrumbModule, InputTextModule, PaginatorModule, TooltipModule, ToastModule, BadgeModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit {
    isLoading    : boolean   = false;
    listData     : Usuario[] = [];
    totalRecords : number    = 0;
    rows         : number    = 10;
    first        : number    = 0;
    listColumns  : ColumnDefinition[] = [];
    listActions  : ActionDefinition[] = [];

    private ultimoLazyLoadEvent : LazyLoadEvent = { first: 0, rows: this.rows };
    formFiltro                  : any = { filtro: ''}

    breadcrumbItems: MenuItem[] = [];
    headerButtons: HeaderButton[] = [];

   constructor(
    public router: Router,
    private usuarioService: UsuarioService,
    private messageService: MessageService
   ) { }


   ngOnInit(): void {
      this.breadcrumbItems = [
        {label:'Início', routerLink: '/'},
        {label:'Usuarios'}
      ];

      this.headerButtons = [
        { label: 'Adicionar', icon: 'fa-solid fa-plus', link: '/usuario/adicionar' }
      ]

      const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
      this.loadUsuarios(eventoInicial);

      this.setupListComponent();
   }

   /**
    * Adriano 10-09-2025
    * Carregar os usuarios
    * @param event 
    */
   loadUsuarios(event: LazyLoadEvent): void {
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
     this.usuarioService.getUsuarios(skip, limit, filtro).subscribe({
       next: (response: any) => {
         this.listData = response.items;
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

    /*
       * Adriano 22-09-2025
       * Ajustar as dados para adicionar no component
     */
     private setupListComponent(): void {
         this.listColumns = [
           { field: 'nome', header: 'Nome' },
           { field: 'email', header: 'E-mail' },
           { field: 'ativo', header: 'Ativo', type: 'badge', badgeConfig: { trueValue: 'Sim', falseValue: 'Não', trueSeverity: 'success', falseSeverity: 'danger' } },
           { field: 'dt_cadastro_formatada', header: 'Data de Cadastro'}
         ];
   
         this.listActions = [
           { actionId: 'edit', icon: 'fa-solid fa-pen', tooltip: 'Editar', severity: 'secondary' },
          //  { actionId: 'delete', icon: 'fa-solid fa-trash', tooltip: 'Deletar', severity: 'danger' }
         ];
     }
   
      /**
      * Adriano 22-09-2025
      * Controlar a funções que seram chamadas no clique dos botões
      * @param event 
      */
     handleAction(event: { action: ActionDefinition, item: Usuario }): void {
       switch (event.action.actionId) {
         case 'edit':
           this.router.navigate([`/usuario/editar/${event.item.id}`]);
           break;
         
       }
     }

    /**
     * Adriano 10-09-2025
     * Acionado ao clicar no botão de filtro.
     * Reseta a paginação para a primeira página e carrega os dados com o filtro.
    */
   filtrarUsuarios(){
    const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
    this.loadUsuarios(eventoInicial);
   }



}
