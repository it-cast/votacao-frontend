import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService, LazyLoadEvent, ConfirmationService, MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from "primeng/badge";

import { ComissaoService } from './comissao.service';
import { AuthService, Camara } from '../../services/auth.service';

import { Comissao } from './comissao.model';
import { HeaderButton } from '../../components/page-header/page-header.model';
import { ColumnDefinition, ActionDefinition } from '../../components/generic-list/generic-list.model';

import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { GenericListComponent } from '../../components/generic-list/generic-list.component';

@Component({
  selector: 'app-comissao',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    ConfirmDialogModule,
    CommonModule,
    ButtonModule,
    CardModule,
    BreadcrumbModule,
    InputTextModule,
    PaginatorModule,
    TooltipModule,
    ToastModule,
    BadgeModule,
    PageHeaderComponent,
    GenericListComponent
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './comissao.component.html',
  styleUrls: ['./comissao.component.scss']
})
export class ComissaoComponent implements OnInit {

  isLoading: boolean = false;
 
  rows: number = 10;
  first: number = 0;
  camara: Camara | null = null;

  listData                    : Comissao[] = [];
  listColumns                 : ColumnDefinition[] = [];
  listActions                 : ActionDefinition[] = [];
  totalRecords                : number = 0;

  private ultimoLazyLoadEvent: LazyLoadEvent = { first: 0, rows: this.rows };
  formFiltro: any = { filtro: '' }

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  constructor(
    public router: Router,
    private comissaoService: ComissaoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.camara = this.authService.getSelectedCamara();

    this.breadcrumbItems = [
      { label: 'Início', routerLink: '/' },
      { label: 'Comissões' }
    ];

    this.headerButtons = [
      { label: 'Adicionar', icon: 'fa-solid fa-plus', link: '/comissao/adicionar' }
    ];

    const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
    this.loadComissoes(eventoInicial);

    this.setupListComponent();
  }

  /**
   * Carrega as comissões de forma paginada.
   * @param event O evento emitido pela tabela PrimeNG
   */
  loadComissoes(event: LazyLoadEvent): void {
    this.isLoading = true;

    this.ultimoLazyLoadEvent = event;
    this.first = event.first ?? 0;
    const limit = event.rows ?? this.rows;

    this.carregarComissoes(this.first, limit, this.formFiltro.filtro);
  }

  /**
   * Função que faz a requisição para retornar as comissões paginadas.
   * @param skip
   * @param limit
   * @param filtro
  */
  carregarComissoes(skip: number, limit: number, filtro?: string) {
    this.comissaoService.getComissoes(skip, limit, filtro, this.camara?.id).subscribe({
      next: (response: any) => {
        this.listData = response.items;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar comissões:', erro);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados das comissões.'
        });
        this.isLoading = false;
      }
    });
  }


   /**
   * Adriano 19-09-2025
   * Definindo as colunas da table 
   */
  private setupListComponent(): void {
    this.listColumns = [
      { field: 'nome', header: 'Nome' },
      { field: 'ativa', header: 'Ativa', type: 'badge', badgeConfig: { trueValue: 'Sim', falseValue: 'Não', trueSeverity: 'success', falseSeverity: 'danger' } },
      { field: 'data_inicio_formatada', header: 'Data Início' },
      { field: 'data_fim_formatada', header: 'Data Fim' },
      { field: 'dt_cadastro_formatada', header: 'Data de Cadastro' }
    ];

    this.listActions = [
      { actionId: 'membros', icon: 'fa-solid fa-users', tooltip: 'Membros', severity: 'secondary'},
      { actionId: 'edit', icon: 'fa-solid fa-pen', tooltip: 'Editar', severity: 'secondary' },
      { actionId: 'delete', icon: 'fa-solid fa-trash', tooltip: 'Deletar', severity: 'danger' }
    ];
  }

  /**
   * Adriano 19-09-2025
   * Definindo qual ação será chamada no botão de acordo com sua função
   * @param event 
  */
  handleAction(event: { action: ActionDefinition, item: Comissao }): void {
    switch (event.action.actionId) {
      case 'membros':
        this.router.navigate([`/comissao/membros/${event.item.id}`]);
        break;
      case 'edit':
        this.router.navigate([`/comissao/editar/${event.item.id}`]);
        break;
      case 'delete':
        this.deleteComissao(event.item.id);
        break;
    }
  }

  /**
   * Acionado ao clicar no botão de filtro.
   * Reseta a paginação para a primeira página e carrega os dados com o filtro.
  */
  filtrarLista() {
    const eventoInicial: LazyLoadEvent = { first: 0, rows: this.rows };
    this.loadComissoes(eventoInicial);
  }

  /**
   * Deleta uma comissão.
   * @param event
   * @param comissaoId
   */
  deleteComissao(comissaoId: number) {
    this.confirmationService.confirm({
     
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
        this.comissaoService.deleteComissao(comissaoId).subscribe({
          next: () => {
            const index = this.listData.findIndex((s: any) => s.id === comissaoId);
            if (index !== -1) {
                this.listData.splice(index, 1);
                this.totalRecords--;
            }
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Registro deletado com sucesso.' });
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error?.detail || 'Erro ao deletar registro.' });
          }
        });
      }
    });
  }
}

