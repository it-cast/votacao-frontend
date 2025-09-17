import { Component } from '@angular/core';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { MandatoCreate } from '../mandato.model';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { UsuarioCreate } from '../../usuario/usuario.model';
import { UsuarioService } from '../../usuario/usuario.service';
import { MandatoService } from '../mandato.service';
import { AuthService, Camara } from '../../../services/auth.service';



@Component({
  selector: 'app-adicionar',
  imports: [BreadcrumbModule, ButtonModule, CardModule,InputTextModule,TextareaModule, MessageModule, ToastModule, FormsModule, RouterLink],
  templateUrl: './adicionar.component.html',
  styleUrl: './adicionar.component.scss'
})
export class AdicionarComponent {

  Form: MandatoCreate = {
    descricao: '',
    data_inicio: '',
    data_fim: '',
    camara_id: null
  }


  isLoading               : boolean = false;
  isEditMode              : boolean = false;
  private currentMandatoId: number | null = null;
  pageTitle               : string = 'Adicionar';

  camara: Camara | null = null;


  constructor(
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private mandatoService: MandatoService,
    private authservice: AuthService

  ){}

  ngOnInit(): void {
    this.camara = this.authservice.getSelectedCamara();
    if(this.camara) this.Form.camara_id = this.camara?.id;

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.pageTitle = 'Editar';
        this.currentMandatoId = +id;
        this.loadUsuarioData(this.currentMandatoId);
      }
    });
  }


  /**
   * Adriano 16-09-2025
   * Puxar o usuário
   * @param id 
  */
  loadUsuarioData(id: number): void {
    this.isLoading = true;
    this.mandatoService.getMadatoById(id).subscribe({
      next: (mandato) => {
        this.Form = { ...mandato };
        console.log(this.Form);
        
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



  onSubmit(form: NgForm){
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    this.isLoading = true;

    const operation = this.isEditMode && this.currentMandatoId
          ? this.mandatoService.updateMandato(this.currentMandatoId, this.Form as MandatoCreate)
          : this.mandatoService.createMandato(this.Form as MandatoCreate);
    
    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Mandato atualizado com sucesso!' : 'Mandato cadastrada com sucesso!';
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
        
        setTimeout(() => {
          this.router.navigate(['/mandato']);
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
