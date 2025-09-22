import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from "primeng/badge";

import { AuthService, Camara } from '../../services/auth.service';
import { MandatoService } from './mandato.service';

import { Mandato } from './mandato.model';
import { HeaderButton } from '../../components/page-header/page-header.model'
import { ColumnDefinition, ActionDefinition } from '../../components/generic-list/generic-list.model';

import { PageHeaderComponent} from '../../components/page-header/page-header.component';
import { GenericListComponent } from '../../components/generic-list/generic-list.component';


@Component({
  selector: 'app-mandato',
  imports: [
    BreadcrumbModule, 
    ButtonModule, 
    InputTextModule,
    PageHeaderComponent,
    GenericListComponent, 
    CommonModule, 
    FormsModule, 
    CardModule, 
    TableModule, 
    ConfirmDialogModule, 
    ToastModule, 
    BadgeModule
  ],
  templateUrl: './mandato.component.html',
  styleUrl: './mandato.component.scss'
})
export class MandatoComponent {
    isLoading                   : boolean   = false; 
   
    first                       : number    = 0;
    camara                      : Camara | null = null;
    rows                        : number = 10; 

    listData                    : Mandato[] = [];
    listColumns                 : ColumnDefinition[] = [];
    listActions                 : ActionDefinition[] = [];
    totalRecords                : number = 0;
    
    private ultimoLazyLoadEvent : LazyLoadEvent = { first: 0, rows: this.rows };
    formFiltro                  : any = { filtro: ''}

    breadcrumbItems: MenuItem[] = [];
    headerButtons: HeaderButton[] = [];


    constructor(
      public router: Router,
      private messageService: MessageService,
      private authService: AuthService,
      private confirmationService: ConfirmationService,
      private mandatoService: MandatoService
    ){}

    ngOnInit(): void {
      this.camara = this.authService.getSelectedCamara();

      this.breadcrumbItems = [
        {label:'Início', routerLink: '/'},
        {label:'Mandatos'}
      ];

      this.headerButtons = [
        { label: 'Adicionar', icon: 'fa-solid fa-plus', link: '/mandato/adicionar' }
      ]
      
      const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
      this.loadMandatos(eventoInicial);

      this.setupListComponent();
    }

    loadMandatos(event: LazyLoadEvent): void {
      this.isLoading = true;

      this.ultimoLazyLoadEvent = event;
      this.first = event.first ?? 0;
      const limit = event.rows ?? this.rows;

      this.carregarMandatos(this.first, limit, this.formFiltro.filtro);
    }



    /**
     * Adriano 19-09-2025
     * Definindo as colunas da table 
     */
    private setupListComponent(): void {
      this.listColumns = [
        { field: 'descricao', header: 'Descrição' },
        { field: 'ativo', header: 'Ativo', type: 'badge', badgeConfig: { trueValue: 'Sim', falseValue: 'Não', trueSeverity: 'success', falseSeverity: 'danger' } },
        { field: 'data_inicio_formatada', header: 'Data Início' },
        { field: 'data_fim_formatada', header: 'Data Fim' },
        { field: 'dt_cadastro_formatada', header: 'Data de Cadastro' }
      ];

      this.listActions = [
        { actionId: 'vereadores', icon: 'fa-solid fa-users', tooltip: 'Vereadores', severity: 'secondary' },
        { actionId: 'edit', icon: 'fa-solid fa-pen', tooltip: 'Editar', severity: 'secondary' },
        { actionId: 'delete', icon: 'fa-solid fa-trash', tooltip: 'Deletar', severity: 'danger' }
      ];
    }

    /**
     * Adriano 19-09-2025
     * Definindo qual ação será chamada no botão de acordo com sua função
     * @param event 
     */
    handleAction(event: { action: ActionDefinition, item: Mandato }): void {
      switch (event.action.actionId) {
        case 'vereadores':
          this.router.navigate([`mandato/vereadores/${event.item.id}`]);
          break;
        case 'edit':
          this.router.navigate([`/mandato/editar/${event.item.id}`]);
          break;
        case 'delete':
          this.deleteMandato(event.item.id);
          break;
      }
    }

    /**
     * Adriano 19-09-2025
     * Chamando o modal para deletar um mandato
     * @param mandatoId 
    */
    private deleteMandato(mandatoId: number): void {
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
          return this.mandatoService.deleteMandato(mandatoId).subscribe(
            (response: any) => {
              //-- Removendo o usuário da lista
              const index = this.listData.findIndex((s: any) => s.id === mandatoId);
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

    /**
     * Adriano 16-09-2025
     * Função que faz a requisição e retornar os mandatos paginados
     * @param skip 
     * @param limit 
     * @param filtro
    */
    carregarMandatos(skip: number, limit: number, filtro?: string){
      this.mandatoService.getMandatos(skip, limit, filtro, this.camara?.id).subscribe({
        next: (response: any) => {
          this.listData = response.items;
          this.totalRecords = response.total;
          this.isLoading = false;
        },
        error: (erro) => {
          console.error('Erro ao buscar mandatos:', erro);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Erro', 
            detail: 'Não foi possível carregar os dados dos mandatos.' 
          });
          this.isLoading = false;
        }
      });
    }

    /**
     * Adriano 16-09-2025
     * Filtrar os dados e retornar a lista correta
     */
    filtrarLista(){
      const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
      this.loadMandatos(eventoInicial);
      
    }

    

}
