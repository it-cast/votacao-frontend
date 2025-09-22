import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MessageService, LazyLoadEvent, ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputTextModule } from 'primeng/inputtext';

import { AuthService } from '../../services/auth.service';
import { ComissaoMembroService } from './comissao-membro.service';


import { ComissaoMembro, PaginatedComissaoMembroResponse } from './comissao-membro.model';
import { ActionDefinition, ColumnDefinition } from '../../components/generic-list/generic-list.model';
import { HeaderButton } from '../../components/page-header/page-header.model';

import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { GenericListComponent } from '../../components/generic-list/generic-list.component';

import { FuncaoComissaoExibir } from '../../constants/comissao.constants'


@Component({
  selector: 'app-comissao-membro',
  imports: [PageHeaderComponent, GenericListComponent, ButtonModule, ConfirmDialogModule, ToastModule,InputTextModule, FormsModule],
  templateUrl: './comissao-membro.component.html',
  styleUrl: './comissao-membro.component.scss'
})
export class ComissaoMembroComponent {
  isLoading: boolean = false;
   
    rows: number = 10;
    first: number = 0;
  
    listData                    : ComissaoMembro[] = [];
    listColumns                 : ColumnDefinition[] = [];
    listActions                 : ActionDefinition[] = [];
    totalRecords                : number = 0;
  
    private ultimoLazyLoadEvent: LazyLoadEvent = { first: 0, rows: this.rows };
    formFiltro: any = { filtro: '' }
  
    breadcrumbItems: MenuItem[] = [];
    headerButtons: HeaderButton[] = [];

    currentComissaoId: number | null = null;
   

     constructor(
      public router: Router,
      private route: ActivatedRoute,
      private comissaoMembroService: ComissaoMembroService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      private authService: AuthService,
    ) { }



    ngOnInit(): void {
      this.route.params.subscribe(params => {
        const id = params['comissaoId'];
        if (id) {
          this.currentComissaoId = +id;
          const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
          this.loadComissoes(eventoInicial);
        }
      });

      this.breadcrumbItems = [
        { label: 'Início', routerLink: '/' },
        { label: 'Comissões', routerLink: '/comissao' },
        { label: 'Membros' }
      ];

      this.headerButtons = [
        { label: 'Voltar', icon: 'fa-solid fa-arrow-left', link: '/comissao/' },
        { label: 'Adicionar', icon: 'fa-solid fa-plus', link: `/comissao/membros/${this.currentComissaoId}/adicionar` },  
      ];

      this.setupListComponent();
      
    }

    /**
     * Adriano 19-09-2025
     * @param event 
     */
    loadComissoes(event: LazyLoadEvent): void {
      this.isLoading = true;

      this.ultimoLazyLoadEvent = event;
      this.first = event.first ?? 0;
      const limit = event.rows ?? this.rows;

      this.carregarComissoes(this.first, limit, this.formFiltro.filtro);
    }


    /**
     * Adriano 19-09-2025
     * @param skip 
     * @param limit 
     * @param filtro 
     */
    carregarComissoes(skip: number, limit: number, filtro?: string) {
      this.comissaoMembroService.getComissoes(skip, limit, filtro,  this.currentComissaoId).subscribe({
        next: (response: PaginatedComissaoMembroResponse) => {
          this.listData = response.items.map(item => ({
            ...item, // Copia todas as propriedades originais do item
            funcao_desc: FuncaoComissaoExibir(item.funcao) // Adiciona a nova propriedade com o texto da função
          }));
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
     * Ajustar as dados para adicionar no component
     */
    private setupListComponent(): void {
      this.listColumns = [
        { field: 'mandato_vereador.vereador.nome', header: 'Vereador' },
        { field: 'mandato_vereador.vereador.partido', header: 'Partido' },
        { field: 'funcao_desc', header: 'Função' },
        { field: 'data_inicio_formatada', header: 'Data Início' },
        { field: 'data_fim_formatada', header: 'Data Fim' },
        { field: 'dt_cadastro_formatada', header: 'Data de Cadastro' }
      ];

      this.listActions = [
        { actionId: 'edit', icon: 'fa-solid fa-pen', tooltip: 'Editar', severity: 'secondary' },
        { actionId: 'delete', icon: 'fa-solid fa-trash', tooltip: 'Deletar', severity: 'danger' }
      ];
    }

    /**
     * Adriano 19-09-2025
     * Controlar a funções que seram chamadas no clique dos botões
     * @param event 
     */
    handleAction(event: { action: ActionDefinition, item: ComissaoMembro }): void {
      switch (event.action.actionId) {
        case 'edit':
          this.router.navigate([`/comissao/membros/${this.currentComissaoId}/editar/${event.item.id}`]);
          break;
        case 'delete':
          this.deleteComissao(event.item.id);
          break;
      }
    }

    /**
     * Adriano 19-09-2025
     * Filtrar os dados da lista
     */
    filtrarLista() {
      const eventoInicial: LazyLoadEvent = { first: 0, rows: this.rows };
      this.loadComissoes(eventoInicial);
    }

    /**
     * Adriano 19-09-2025
     * Deletar um membro da comissão
     * @param comissaoMembroId 
     */
    deleteComissao(comissaoMembroId: number) {
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
          this.comissaoMembroService.deleteComissaoMembro(comissaoMembroId).subscribe({
            next: () => {
              const index = this.listData.findIndex((s: any) => s.id === comissaoMembroId);
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
