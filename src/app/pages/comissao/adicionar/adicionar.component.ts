import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { SelectModule } from "primeng/select";
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";

import { ComissaoService } from '../comissao.service';
import { AuthService, Camara } from '../../../services/auth.service';

import { COMISSAO_ATIVA_OPCOES, ComissaoAtivoStatus } from '../../../constants/comissao.constants';

import { ComissaoCreate } from '../comissao.model';
import { HeaderButton } from '../../../components/page-header/page-header.model';

import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { FormInputComponent } from '../../../components/form-input/form-input.component';
import { FormSelectComponent } from '../../../components/form-select/form-select.component';

@Component({
  selector: 'app-adicionar',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    BreadcrumbModule, 
    ButtonModule, 
    CardModule, 
    InputTextModule, 
    InputSwitchModule, 
    MessageModule, 
    ToastModule,
    SelectModule,
    PageHeaderComponent,
    FormInputComponent,
    FormSelectComponent
  ],
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss'],
  providers: [MessageService]
})
export class AdicionarComponent implements OnInit {

  public readonly ComissaoAtivoStatus = ComissaoAtivoStatus;
  public readonly COMISSAO_ATIVA_OPCOES = COMISSAO_ATIVA_OPCOES;

  Form: ComissaoCreate = {
    nome: '',
    ativa: ComissaoAtivoStatus.SIM,
    data_inicio: '',
    data_fim: null,
    camara_id: null
  }

  isLoading: boolean = false;
  isEditMode: boolean = false;
  private currentComissaoId: number | null = null;
  pageTitle: string = 'Adicionar';
  camara: Camara | null = null;

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private comissaoService: ComissaoService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    this.camara = this.authservice.getSelectedCamara();
    if(this.camara) this.Form.camara_id = this.camara.id;

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.pageTitle = 'Editar';
        this.currentComissaoId = +id;
        this.loadComissaoData(this.currentComissaoId);
      }
    });

    this.breadcrumbItems = [
      {label:'Início', routerLink: '/'},
      {label:'Comissões', routerLink: '/comissao'},
      {label: this.pageTitle}
    ];

    this.headerButtons = [
      { label: 'Voltar', icon: 'fa-solid fa-arrow-left', link: '/comissao' }
    ];
  }

  loadComissaoData(id: number): void {
    this.isLoading = true;
    this.comissaoService.getComissaoById(id).subscribe({
      next: (comissao) => {
        this.Form = { ...comissao };
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados da comissão para edição.'
        });
        this.isLoading = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    this.isLoading = true;

    const operation = this.isEditMode && this.currentComissaoId
      ? this.comissaoService.updateComissao(this.currentComissaoId, this.Form)
      : this.comissaoService.createComissao(this.Form);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Comissão atualizada com sucesso!' : 'Comissão cadastrada com sucesso!';
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });

        setTimeout(() => {
          this.router.navigate(['/comissao']);
        }, 1500);
      },
      error: (err: any) => {
         let detailMessage = err.error?.detail || 'Ocorreu um erro desconhecido ao salvar.';
         this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: detailMessage,
            life: 5000
        });
        this.isLoading = false;
      }
    });
  }
}
