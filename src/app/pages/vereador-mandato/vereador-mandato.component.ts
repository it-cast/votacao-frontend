import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BreadcrumbModule } from "primeng/breadcrumb";
import { Button } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { BadgeModule } from "primeng/badge";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { LazyLoadEvent, MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';


import { VereadorMandatoService } from './vereador-mandato.service';

import { FuncaoNoMandato, FUNCOES_NO_MANDATO_OPCOES, FuncaoExibir } from '../../constants/vereador.constants';

import { MandatoVereador, PaginatedMandatoVereadorResponse} from './vereador-mandato.model'
import { HeaderButton } from '../../components/page-header/page-header.model';

import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ColumnDefinition, ActionDefinition } from '../../components/generic-list/generic-list.model';
import { GenericListComponent } from '../../components/generic-list/generic-list.component';
import { FuncaoComissaoExibir } from '../../constants/comissao.constants';


@Component({
  selector: 'app-vereador-mandato',
  imports: [BreadcrumbModule, Button, CardModule, TableModule,InputTextModule,PageHeaderComponent,GenericListComponent, BadgeModule,FormsModule, ToastModule, ConfirmDialogModule],
  templateUrl: './vereador-mandato.component.html',
  styleUrl: './vereador-mandato.component.scss'
})
export class VereadorMandatoComponent {
  isLoading           : boolean   = false;
  listData   : MandatoVereador[] = [];
  totalRecords        : number    = 0;
  rows                : number    = 10;
  first               : number    = 0;

  listColumns     : ColumnDefinition[] = [];
  listActions     : ActionDefinition[] = [];

  mandatoId            : number    = 0;
  currentMandatoId     : number | null = null;

  private ultimoLazyLoadEvent : LazyLoadEvent = { first: 0, rows: this.rows };
  formFiltro                  : any = { filtro: ''}

  public readonly FuncaoNoMandato = FuncaoNoMandato;
  public readonly FUNCOES_NO_MANDATO_OPCOES = FUNCOES_NO_MANDATO_OPCOES;

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private vereadorMandatoService: VereadorMandatoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['mandatoId'];
      if (id) {
        this.currentMandatoId = +id;
        const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
        this.loadVereadoresMandato(eventoInicial);
        this.setupListComponent();
      }
    });

    this.breadcrumbItems = [
      {label:'Início', routerLink: '/'},
      {label:'Mandatos', routerLink: '/mandato'},
      {label:'Vereadores'}
    ];

    this.headerButtons = [
      { label: 'Voltar', icon: 'fa-solid fa-arrow-left', link: '/mandato' },
      { label: 'Adicionar', icon: 'fa-solid fa-plus', link: `/mandato/vereadores/${this.currentMandatoId}/adicionar` }
    ]

  }

  /**
  * Adriano 10-09-2025
  * Carregar os usuarios
  * @param event 
  */
  loadVereadoresMandato(event: LazyLoadEvent): void {
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
    this.vereadorMandatoService.getVereadorMandato(skip, limit, filtro, this.currentMandatoId).subscribe({
      next: (response: PaginatedMandatoVereadorResponse) => {
        this.listData = response.items.map(item => ({
          ...item, // Copia todas as propriedades originais do item
          funcao_desc: FuncaoExibir(item.funcao) // Adiciona a nova propriedade com o texto da função
        }));
        
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
  filtrarVereadoresMandato(){
    const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
    this.loadVereadoresMandato(eventoInicial);
  }

  deleteVereador(vereadorId: number) {
    
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
        return this.vereadorMandatoService.deleteVereadorMandato(vereadorId).subscribe(
          (response: any) => {
            //-- Removendo o usuário da lista
            const index = this.listData.findIndex((s: any) => s.id === vereadorId);
            if (index !== -1) this.listData.splice(index, 1);
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



    /*
      * Adriano 22-09-2025
      * Ajustar as dados para adicionar no component
    */
    private setupListComponent(): void {
        this.listColumns = [
          { field: 'vereador.nome', header: 'Nome' },
          { field: 'vereador.email', header: 'E-mail' },
          { field: 'vereador.partido', header: 'Partido'},
          { field: 'funcao_desc', header: 'Função'},
          { field: 'vereador.ativo', header: 'Ativo', type: 'badge', badgeConfig: { trueValue: 'Sim', falseValue: 'Não', trueSeverity: 'success', falseSeverity: 'danger' } },
          
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
    handleAction(event: { action: ActionDefinition, item: MandatoVereador }): void {
      switch (event.action.actionId) {
        case 'edit':
          this.router.navigate([`mandato/vereadores/${this.currentMandatoId}/editar/${event.item.id}`]);
          break;
        case 'delete':
          this.deleteVereador(event.item.id);
          break;
      }
    }
}
