import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UsuarioAtivoStatus, USUARIO_ATIVO_OPCOES } from '../../../constants/usuario.constants';

import { MenuItem, MessageService } from 'primeng/api';

import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

import { HeaderButton } from '../../../components/page-header/page-header.model';
import { VereadorCreate } from '../vereador.model';

import { FormInputComponent } from '../../../components/form-input/form-input.component';
import { FormSelectComponent } from '../../../components/form-select/form-select.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { FormMaskComponent } from '../../../components/form-mask/form-mask.component';

import { VereadorService } from '../vereador.service';

@Component({
  selector: 'app-adicionar',
  imports: [CommonModule, FormsModule,PasswordModule,SelectModule,FormInputComponent,FormSelectComponent,PageHeaderComponent,FormMaskComponent, ButtonModule, CardModule, BreadcrumbModule, InputTextModule, ToastModule, MessageModule, FloatLabelModule],
  templateUrl: './adicionar.component.html',
  styleUrl: './adicionar.component.scss'
})
export class AdicionarComponent implements OnInit {

  public readonly UsuarioAtivoStatus        = UsuarioAtivoStatus;
  public readonly USUARIO_ATIVO_OPCOES      = USUARIO_ATIVO_OPCOES;
  
  formCadastro: VereadorCreate = {
    nome: '',
    email: '',
    cpf: '',
    partido: '',
    telefone: '',
    ativo: UsuarioAtivoStatus.SIM,
  };

  isLoading               : boolean = false;
  isEditMode              : boolean = false;
  private currentVereadorId: number | null = null;
  pageTitle               : string = 'Adicionar';

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private vereadorService: VereadorService
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.pageTitle = 'Editar';
        this.currentVereadorId = +id;
        this.loadVereadorData(this.currentVereadorId);
      }
    });

    this.breadcrumbItems = [
      {label:'Início', routerLink: '/'},
      {label:'Vereadores', routerLink: '/vereador'},
      {label: this.pageTitle}
    ];

    this.headerButtons = [
      { label: 'Voltar', icon: 'fa-solid fa-arrow-left', link: '/vereador' }
    ];
  }

  /**
   * Adriano 29-09-2025
   * Puxar o vereador
   * @param id 
   */
  loadVereadorData(id: number): void {
    this.isLoading = true;
    this.vereadorService.getVereadorById(id).subscribe({
      next: (vereador) => {
        this.formCadastro = { ...vereador };
        console.log(this.formCadastro);
        
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Não foi possível carregar os dados do vereador para edição.' 
        });
        this.isLoading = false;
      }
    });
  }


  onSubmit(form: NgForm): void {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    this.formCadastro.cpf = this.cleanMaskedValue(this.formCadastro.cpf);
    this.formCadastro.telefone = this.cleanMaskedValue(this.formCadastro.telefone);
    
    this.isLoading = true;

    const operation = this.isEditMode && this.currentVereadorId
          ? this.vereadorService.updateVereador(this.currentVereadorId, this.formCadastro as VereadorCreate)
          : this.vereadorService.createVereador(this.formCadastro as VereadorCreate);
    
    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Vereador atualizado com sucesso!' : 'Vereador cadastrada com sucesso!';
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
        
        setTimeout(() => {
          this.router.navigate(['/vereador']);
        }, 1500);
      },

      error: (err: any) => {
        let detailMessage = 'Ocorreu um erro desconhecido ao salvar.';

        // Adicione este log para ver a estrutura exata do erro no console do navegador
        console.error("Estrutura completa do erro:", err); 

        const errorBody = err.error; // O corpo do erro da API está aqui
        

        if (errorBody && Array.isArray(errorBody.detail)) {
          // Mapeia o array de erros para uma string legível
          detailMessage = errorBody.detail.map((e: any) => {
            if (e.type === 'string_too_short') {
              // Acessa o nome do campo em e.loc[1]
              const fieldName = e.loc[1];
              const minLength = e.ctx.min_length;
              return `O campo '${fieldName}' deve ter no mínimo ${minLength} caracteres.`;
            }
            // Fallback para outras mensagens de erro do Pydantic
            return e.msg; 
          }).join(' \n '); // Usa quebra de linha para exibir múltiplos erros
        } else if (errorBody && errorBody.detail) {
          // Caso a API retorne uma string (erros 400, 404, etc.)
          detailMessage = errorBody.detail;
        }

        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro de Validação', 
          detail: detailMessage,
          life: 5000 // Aumenta o tempo que a mensagem fica na tela
        });
        this.isLoading = false;
      }
    });
  }

  /**
   * Remove todos os caracteres não numéricos de uma string.
   * @param value O valor da string a ser limpa.
   * @returns A string contendo apenas dígitos.
   */
  private cleanMaskedValue(value: string | null | undefined): string {
    return value ? String(value).replace(/\D/g, '') : '';
  }
}
