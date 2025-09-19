import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { MenuItem, MessageService } from 'primeng/api';

import { UsuarioService } from '../usuario.service';

import { UsuarioAtivoStatus, USUARIO_ATIVO_OPCOES, UsuarioSuperuserStatus, USUARIO_SUPERUSER_OPCOES } from '../../../constants/usuario.constants';

import { UsuarioCreate} from '../usuario.model';
import { HeaderButton } from '../../../components/page-header/page-header.model';

import { PageHeaderComponent } from '../../../components/page-header/page-header.component';

@Component({
  selector: 'app-adicionar',
  imports: [CommonModule, FormsModule,PasswordModule,SelectModule,PageHeaderComponent, ButtonModule, CardModule, BreadcrumbModule, InputTextModule, ToastModule, MessageModule, FloatLabelModule],
  templateUrl: './adicionar.component.html',
  styleUrl: './adicionar.component.scss'
})
export class AdicionarComponent implements OnInit {

 

  public readonly UsuarioAtivoStatus        = UsuarioAtivoStatus;
  public readonly USUARIO_ATIVO_OPCOES      = USUARIO_ATIVO_OPCOES;
  
  public readonly UsuarioSuperuserStatus    = UsuarioSuperuserStatus;
  public readonly USUARIO_SUPERUSER_OPCOES  = USUARIO_SUPERUSER_OPCOES;

  formCadastro: UsuarioCreate = {
    nome: '',
    email: '',
    senha: '',
    confSenha: '',
    is_superuser: UsuarioSuperuserStatus.SIM,
    ativo: UsuarioAtivoStatus.SIM,
  };

  isLoading               : boolean = false;
  isEditMode              : boolean = false;
  private currentUsuarioId: number | null = null;
  pageTitle               : string = 'Adicionar';

  errorPassword: any = { 
    required: false,
    requiredConf: false,
    divergent: false,
  };

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ){}

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.pageTitle = 'Editar';
        this.currentUsuarioId = +id;
        this.loadUsuarioData(this.currentUsuarioId);
      }
    });

    this.breadcrumbItems = [
      {label:'Início', routerLink: '/'},
      {label:'Usuários', routerLink: '/usuario'},
      {label: this.pageTitle}
    ];

    this.headerButtons = [
      { label: 'Voltar', icon: 'fa-solid fa-arrow-left', link: '/usuario' }
    ];
  }

  /**
   * Adriano 16-09-2025
   * Puxar o usuário
   * @param id 
   */
  loadUsuarioData(id: number): void {
    this.isLoading = true;
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.formCadastro = { ...usuario };
        console.log(this.formCadastro);
        
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Não foi possível carregar os dados do usuario para edição.' 
        });
        this.isLoading = false;
      }
    });
  }


  /**
   * Adriano 16-09-2025
   * Salvar os dados do usuário
   * @param form 
   * @returns 
   */
  onSubmit(form: NgForm): void {
      if (form.invalid) {
        Object.values(form.controls).forEach(control => control.markAsTouched());
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
        return;
      }
  
      this.isLoading = true;

      const operation = this.isEditMode && this.currentUsuarioId
            ? this.usuarioService.updateUsuario(this.currentUsuarioId, this.formCadastro as UsuarioCreate)
            : this.usuarioService.createUsuario(this.formCadastro as UsuarioCreate);
      
      operation.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Usuario atualizado com sucesso!' : 'Usuario cadastrada com sucesso!';
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
          
          setTimeout(() => {
            this.router.navigate(['/usuario']);
          }, 1500);
        },
        // --- BLOCO DE ERRO MODIFICADO ---
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

}
