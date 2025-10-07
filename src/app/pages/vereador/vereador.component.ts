import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MenuItem, LazyLoadEvent, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';



import { Vereador } from './vereador.model';
import { HeaderButton } from '../../components/page-header/page-header.model'
import { ColumnDefinition, ActionDefinition } from '../../components/generic-list/generic-list.model';

import { GenericListComponent } from '../../components/generic-list/generic-list.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

import { VereadorService } from './vereador.service';
import { ConfirmDialogModule } from "primeng/confirmdialog";


@Component({
  selector: 'app-vereador',
  imports: [CommonModule, FormsModule, TableModule, PageHeaderComponent, GenericListComponent, ButtonModule, CardModule, BreadcrumbModule, InputTextModule, PaginatorModule, TooltipModule, ToastModule, BadgeModule, ConfirmDialogModule],
  templateUrl: './vereador.component.html',
  styleUrl: './vereador.component.scss'
})
export class VereadorComponent implements OnInit {
  isLoading    : boolean   = false;
  listData     : Vereador[] = [];
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
    private vereadorService: VereadorService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
      this.breadcrumbItems = [
        {label:'Início', routerLink: '/'},
        {label:'Vereadores'}
      ];

      this.headerButtons = [
        { label: 'Adicionar', icon: 'fa-solid fa-plus', link: '/vereador/adicionar' }
      ]

      const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
      this.loadVereadores(eventoInicial);

      this.setupListComponent();
  }

  /**
    * Adriano 29-09-2025
    * Carregar os vereadores
    * @param event 
  */
  loadVereadores(event: LazyLoadEvent): void {
     this.isLoading = true;
     this.ultimoLazyLoadEvent = event;
     this.first = event.first ?? 0;
     const limit = event.rows ?? this.rows;
     this.carregarDados(this.first, limit, this.formFiltro.filtro);
  }

   /**
    * Adriano 29-09-2025
    * Carregar so dados de todos os vereadores paginados
    * @param skip 
    * @param limit 
    * @param filtro 
  */
  carregarDados(skip: number, limit: number, filtro?: string){
     this.vereadorService.getVereadores(skip, limit, filtro).subscribe({
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
           detail: 'Não foi possível carregar os dados dos vereadores.' 
         });
         this.isLoading = false;
       }

     })
  }

  /*
    * Adriano 29-09-2025
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
    * Adriano 29-09-2025
    * Controlar a funções que seram chamadas no clique dos botões
    * @param event 
  */
  handleAction(event: { action: ActionDefinition, item: Vereador }): void {
    switch (event.action.actionId) {
      case 'edit':
        this.router.navigate([`/vereador/editar/${event.item.id}`]);
        break;
      
    }
  }

  /**
   * Adriano 29-09-2025
   * Acionado ao clicar no botão de filtro.
   * Reseta a paginação para a primeira página e carrega os dados com o filtro.
  */
  filtrar(){
    const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
    this.loadVereadores(eventoInicial);
  }

}
