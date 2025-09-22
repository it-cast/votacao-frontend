import { Component, Input, Output, EventEmitter } from '@angular/core';


import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';

import { ColumnDefinition, ActionDefinition } from './generic-list.model';
import { LazyLoadEvent } from 'primeng/api';



@Component({
  selector: 'app-generic-list',
  imports: [
     TableModule,
     CardModule,
     ButtonModule,
     TooltipModule,
     BadgeModule
  ],
  templateUrl: './generic-list.component.html',
  styleUrl: './generic-list.component.scss'
})
export class GenericListComponent {
  // --- INPUTS (Dados que o componente recebe) ---
  @Input() title: string = 'Lista';
  @Input() data: any[] = [];
  @Input() columns: ColumnDefinition[] = [];
  @Input() actions: ActionDefinition[] = [];
  @Input() loading: boolean = false;
  @Input() totalRecords: number = 0;
  @Input() rows: number = 10;

  // --- OUTPUTS (Eventos que o componente emite) ---
  @Output() onPageChange = new EventEmitter<LazyLoadEvent>();
  @Output() onActionClick = new EventEmitter<{ action: ActionDefinition, item: any }>();

  /**
   * Emite o evento de mudança de página para o componente pai.
   * @param event O evento do PrimeNG.
   */
  onPage(event: LazyLoadEvent): void {
    this.onPageChange.emit(event);
  }

  /**
   * Emite qual ação foi clicada e para qual item.
   * @param action A definição da ação.
   * @param item O objeto de dados da linha.
   */
  emitAction(action: ActionDefinition, item: any): void {
    this.onActionClick.emit({ action, item });
  }


   /**
   * Navega por um objeto usando uma string de caminho com notação de ponto.
   * Exemplo: resolveNestedValue(item, 'mandato_vereador.vereador.nome')
   * @param obj O objeto de dados (ex: um item da lista).
   * @param path A string do caminho (ex: 'nome' ou 'comissao.nome').
   * @returns O valor encontrado ou uma string vazia se o caminho for inválido.
   */
  resolveNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((p, c) => (p && p[c]) ? p[c] : '', obj);
  }

}
