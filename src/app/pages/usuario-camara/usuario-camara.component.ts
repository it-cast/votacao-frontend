import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MessageService, LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { UsuarioCamaraService } from './usuario-camara.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from "primeng/badge";
import { MenuItem } from 'primeng/api';

import { AuthService, Camara } from '../../services/auth.service';

import { UsuarioCamara } from './usuario-camara.model'
import { PAPEIS_NA_CAMARA_OPCOES } from '../../constants/usuario.constants';
import { HeaderButton } from '../../components/page-header/page-header.model';

import { PageHeaderComponent} from '../../components/page-header/page-header.component'
import { GenericListComponent} from '../../components/generic-list/generic-list.component'
import { ColumnDefinition, ActionDefinition } from '../../components/generic-list/generic-list.model';


@Component({
  selector: 'app-usuario-camara',
  imports: [ButtonModule, CardModule, TableModule,PageHeaderComponent,GenericListComponent, FormsModule, ConfirmDialogModule, BreadcrumbModule, InputTextModule, PaginatorModule, TooltipModule, ToastModule, BadgeModule],
  templateUrl: './usuario-camara.component.html',
  styleUrl: './usuario-camara.component.scss'
})
export class UsuarioCamaraComponent {
  isLoading       : boolean   = false;
  listData        : UsuarioCamara[] = [];
  listColumns     : ColumnDefinition[] = [];
  listActions     : ActionDefinition[] = [];
  totalRecords    : number = 0;
  rows            : number    = 10;
  first           : number    = 0;

  camaraId        : number    = 0;
  currentCamaraId : number | null = null;

  private ultimoLazyLoadEvent : LazyLoadEvent = { first: 0, rows: this.rows };
  formFiltro                  : any = { filtro: ''}

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  camara: Camara | null = null;
 


  constructor(
    public  router: Router,
    private route: ActivatedRoute,
    private usuarioCamaraService: UsuarioCamaraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {
  }


  ngOnInit(): void {
    this.camara = this.authService.getSelectedCamara();

    
    this.route.params.subscribe(params => {
      const id = params['camaraId'];
      if (id) {
        this.currentCamaraId = +id;
        const eventoInicial: LazyLoadEvent = { first: this.first, rows: this.rows };
        this.loadUsuariosCamara(eventoInicial);


        this.breadcrumbItems = [
          {label:'Início', routerLink: '/'},
          {label:'Usuarios'}
        ];
    
    
        if(!this.camara) this.headerButtons.unshift({ label: 'Voltar', icon: 'fa-solid fa-arrow-left', link: '/camara/'})
        this.headerButtons.push({ label: 'Adicionar', icon: 'fa-solid fa-plus', link: `/camara/usuarios/${this.currentCamaraId}/adicionar` })
    
        this.setupListComponent();
      }
    });

  }

  /*
    * Adriano 22-09-2025
    * Ajustar as dados para adicionar no component
  */
  private setupListComponent(): void {
      this.listColumns = [
        { field: 'usuario.nome', header: 'Nome' },
        { field: 'usuario.email', header: 'E-mail' },
        { field: 'papel_desc', header: 'Papel'},
        { field: 'vereador_nome', header: 'Vereador'},
        { field: 'ativo', header: 'Ativo', type: 'badge', badgeConfig: { trueValue: 'Sim', falseValue: 'Não', trueSeverity: 'success', falseSeverity: 'danger' } },
        
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
  handleAction(event: { action: ActionDefinition, item: UsuarioCamara }): void {
    switch (event.action.actionId) {
      case 'edit':
        this.router.navigate([`camara/usuarios/${this.currentCamaraId}/editar/${event.item.id}`]);
        break;
      case 'delete':
        this.deleteUsuario(event.item.id);
        break;
    }
  }

  /**
  * Adriano 10-09-2025
  * Carregar os usuarios
  * @param event 
  */
  loadUsuariosCamara(event: LazyLoadEvent): void {
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
    this.usuarioCamaraService.getCamaraUsuarios(skip, limit, filtro, this.currentCamaraId).subscribe({
      next: (response: any) => {
        
        this.listData = response.items.map((item: UsuarioCamara) => {
          const papelEncontrado = PAPEIS_NA_CAMARA_OPCOES.find(papel => papel.key === item.papel);

          return {
            ...item, 
            papel_desc: papelEncontrado?.value || 'Não definido',
            vereador_nome: item.vereador?.nome || '',
          };
        });
        this.totalRecords = response.total;
        this.isLoading = false;

        console.log(this.listData);
        
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
    this.loadUsuariosCamara(eventoInicial);
  }


  deleteUsuario(usuarioId: number) {
    
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
        return this.usuarioCamaraService.deleteCamaraUsuario(usuarioId).subscribe(
          (response: any) => {
            //-- Removendo o usuário da lista
            const index = this.listData.findIndex((s: any) => s.id === usuarioId);
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

}
