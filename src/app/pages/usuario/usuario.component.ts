import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';

import { MessageService, LazyLoadEvent } from 'primeng/api';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Usuario } from './usuario.model';
import { BadgeModule } from "primeng/badge";

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, CardModule, BreadcrumbModule, InputTextModule, PaginatorModule, TooltipModule, ToastModule, BadgeModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit {
   isLoading    : boolean   = false;
   usuarios     : Usuario[] = [];
   totalRecords : number    = 0;
   rows         : number    = 10;
   first        : number    = 0;

   private ultimoLazyLoadEvent : LazyLoadEvent = { first: 0, rows: this.rows };
   formFiltro                  : any = { filtro: ''}

   constructor(
    public router: Router,
    private usuarioService: UsuarioService,
    private messageService: MessageService
   ) { }


   ngOnInit(): void {
     const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
     this.loadUsuarios(eventoInicial);
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
         this.usuarios = response.items;
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
    this.loadUsuarios(eventoInicial);
   }



}
