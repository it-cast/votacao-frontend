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

import { PageHeaderComponent } from '../../components/page-header/page-header.component';

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
    PageHeaderComponent
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './comissao.component.html',
  styleUrls: ['./comissao.component.scss']
})
export class ComissaoComponent implements OnInit {

  isLoading: boolean = false;
  comissoes: Comissao[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;
  camara: Camara | null = null;

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
        this.comissoes = response.items;
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
  deleteComissao(event: Event, comissaoId: number) {
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
        this.comissaoService.deleteComissao(comissaoId).subscribe({
          next: () => {
            const index = this.comissoes.findIndex((s: any) => s.id === comissaoId);
            if (index !== -1) {
                this.comissoes.splice(index, 1);
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

