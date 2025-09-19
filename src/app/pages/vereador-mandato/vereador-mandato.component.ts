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

import { MandatoVereador} from './vereador-mandato.model'
import { HeaderButton } from '../../components/page-header/page-header.model';

import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-vereador-mandato',
  imports: [BreadcrumbModule, Button, CardModule, TableModule,InputTextModule,PageHeaderComponent, BadgeModule,FormsModule, ToastModule, ConfirmDialogModule],
  templateUrl: './vereador-mandato.component.html',
  styleUrl: './vereador-mandato.component.scss'
})
export class VereadorMandatoComponent {
  isLoading           : boolean   = false;
  vereadoresMandato   : MandatoVereador[] = [];
  totalRecords        : number    = 0;
  rows                : number    = 10;
  first               : number    = 0;

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
      next: (response: any) => {
        this.vereadoresMandato = response.items;
        console.log(this.vereadoresMandato);
        
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

  FuncaoExibir(funcao: number): string { return FuncaoExibir(funcao) }

  deleteVereador(event: Event, vereadorId: number) {
    
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
        return this.vereadorMandatoService.deleteVereadorMandato(vereadorId).subscribe(
          (response: any) => {
            //-- Removendo o usuário da lista
            const index = this.vereadoresMandato.findIndex((s: any) => s.id === vereadorId);
            if (index !== -1) this.vereadoresMandato.splice(index, 1);
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
