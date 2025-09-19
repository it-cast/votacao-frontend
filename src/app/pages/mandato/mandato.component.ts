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

import { PageHeaderComponent} from '../../components/page-header/page-header.component'

@Component({
  selector: 'app-mandato',
  imports: [BreadcrumbModule, ButtonModule, InputTextModule,PageHeaderComponent, CommonModule, FormsModule, CardModule, TableModule, ConfirmDialogModule, ToastModule, BadgeModule],
  templateUrl: './mandato.component.html',
  styleUrl: './mandato.component.scss'
})
export class MandatoComponent {
    isLoading                   : boolean   = false; 
    mandatos                    : Mandato[]  = [];
    totalRecords                : number    = 0;
    rows                        : number    = 10; 
    first                       : number    = 0;
    camara                      : Camara | null = null;
    
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
    }

    loadMandatos(event: LazyLoadEvent): void {
      this.isLoading = true;

      this.ultimoLazyLoadEvent = event;
      this.first = event.first ?? 0;
      const limit = event.rows ?? this.rows;

      this.carregarMandatos(this.first, limit, this.formFiltro.filtro);
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
          this.mandatos = response.items;
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

    /**
     * Adriano 16-09-2025
     * Deletar um mandato
     * @param event 
     * @param mandatoId 
     */
    deleteMandato(event: Event, mandatoId: number) {
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
          return this.mandatoService.deleteMandato(mandatoId).subscribe(
            (response: any) => {
              //-- Removendo o usuário da lista
              const index = this.mandatos.findIndex((s: any) => s.id === mandatoId);
              if (index !== -1) this.mandatos.splice(index, 1);
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
