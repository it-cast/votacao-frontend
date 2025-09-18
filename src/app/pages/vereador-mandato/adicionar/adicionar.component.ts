import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, of } from 'rxjs'; // Importe o Observable

import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { SelectModule } from "primeng/select";
import { MessageModule } from "primeng/message";
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from "primeng/toast";
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';


import { VereadorService } from '../../vereador/vereador.service';
import { VereadorMandatoService } from '../vereador-mandato.service';
import { MandatoVereadorCreate } from '../vereador-mandato.model';

import { FuncaoNoMandato, VeradorAtivoStatus, VEREADOR_ATIVO_OPCOES, FUNCOES_NO_MANDATO_OPCOES } from '../../../constants/vereador.constants'

import { keepOnlyNumbers } from '../../../helpers/utils/formatters'


@Component({
  selector: 'app-adicionar',
  imports: [BreadcrumbModule, ButtonModule, CardModule, SelectModule, MessageModule,InputMaskModule, ToastModule, CommonModule, FormsModule,InputTextModule],
  templateUrl: './adicionar.component.html',
  styleUrl: './adicionar.component.scss',
  providers: [MessageService]
})
export class AdicionarComponent implements OnInit {
  pageTitle                 : string        = 'Adicionar';
  currentMandatoId          : number | null = null;
  currentVereadorMandatoId  : number | null = null;
  breadcrumbItems!          : MenuItem[];
  isEditMode                : boolean       = false;

  public readonly VeradorAtivoStatus = VeradorAtivoStatus;
  public readonly VEREADOR_ATIVO_OPCOES = VEREADOR_ATIVO_OPCOES;

  public readonly FuncaoNoMandato = FuncaoNoMandato;
  public readonly FUNCOES_NO_MANDATO_OPCOES = FUNCOES_NO_MANDATO_OPCOES;

  

  formCadastro: MandatoVereadorCreate = {
    id: null,
    funcao: FuncaoNoMandato.LEGISLATIVA,
    vereador: {
      id: null,
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      partido: '',
      ativo: VeradorAtivoStatus.SIM
    },
    mandato_id: null,
    vereador_id: null
  }



  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private vereadorMandatoService: VereadorMandatoService,
    private vereadorService: VereadorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const mandatoId = params['mandatoId'];
      const id = params['id'];
      if (id) {
        this.currentVereadorMandatoId = +id;
        this.formCadastro.id = this.currentVereadorMandatoId;
        this.isEditMode = true;
        this.pageTitle = 'Editar';
        this.loadVereadorData(this.currentVereadorMandatoId);
      }
      
      if (mandatoId) {
        this.currentMandatoId = +mandatoId;
        this.formCadastro.mandato_id = mandatoId;
      }

      this.breadcrumbItems = [
        { label: 'Início', routerLink: '/' },
        { label: 'Vereadores', routerLink: `/mandato/vereadores/${this.currentMandatoId}` },
        { label: this.pageTitle }
      ];
    });
  }

  /**
   * Adriano 15-09-2025
   * Faz a requisição para o backend para retonar o usuário para edição
   * @param id 
  */
  loadVereadorData(id: number): void {
    this.vereadorMandatoService.getVereadorMandatoById(id).subscribe({
      next: (vereador) => {
        console.log('vereador', vereador);
        this.preencherFormularioMandatoVereador(vereador);
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Não foi possível carregar os dados do usuario para edição.' 
        });
      }
    });
  }

  preencherFormularioMandatoVereador(dados: any): void {
    //-- Define as chaves que podem ser copiadas diretamente para o formulário principal
    const chavesPrincipais = ['id', 'funcao', 'mandato_id', 'vereador_id'];

    for (const chave of chavesPrincipais) {
      //-- Verifica se a chave existe em ambos os objetos antes de copiar
      if (chave in dados && chave in this.formCadastro) {
        (this.formCadastro as any)[chave] = dados[chave as keyof typeof dados];
      }
    }

    //-- Define as chaves que podem ser copiadas diretamente para o vereador aninhado
    const chavesVereador = ['id', 'nome', 'email', 'telefone', 'cpf', 'partido'];

    for (const chave of chavesVereador) {
      // Verifica se a chave existe em ambos os objetos aninhados antes de copiar
      if (chave in dados.vereador && chave in this.formCadastro.vereador!) {
        (this.formCadastro.vereador as any)[chave] = dados.vereador[chave as keyof typeof dados.vereador];
      }
    }

    //-- Trata os casos especiais que não podem ser copiados diretamente
    this.formCadastro.vereador!.ativo = dados.vereador.ativo ? VeradorAtivoStatus.SIM : VeradorAtivoStatus.NAO;

    //-- Para verificar o resultado no console do navegador
    console.log("Formulário preenchido (com for):",this. formCadastro);
  }

  onSubmit(form: NgForm){
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios.' });
      return;
    }

    this.formCadastro.vereador!.cpf = keepOnlyNumbers(this.formCadastro.vereador?.cpf);
    this.formCadastro.vereador!.telefone = keepOnlyNumbers(this.formCadastro.vereador?.telefone);

    console.log('this.formCadastro', this.formCadastro);

    const operation = this.isEditMode && this.currentVereadorMandatoId
          ? this.vereadorMandatoService.updateVereadorMandato(this.currentVereadorMandatoId,  this.formCadastro)
          : this.vereadorMandatoService.createVereadorMandato(this.formCadastro);
    
    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Vereador atualizado com sucesso!' : 'Vereador cadastrada com sucesso!';
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
        
        setTimeout(() => {
          this.router.navigate([`/mandato/vereadores/${this.currentMandatoId}`]);
        }, 1500);
      },
      error: (err: any) => {
        let detailMessage = 'Ocorreu um erro desconhecido ao salvar.';

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
        
      }
    });
    
  }


  /**
   * Adriano 18-09-2025
   * Preenche o formulário com os dados do vereador recebido da API.
   * @param resposta Objeto com os dados do vereador.
   */
  private preencherDadosVereador(resposta: any): void {
    // Garante que o objeto vereador no formulário existe.
    const vereadorForm = this.formCadastro.vereador!;

    // Itera sobre cada chave (ex: 'nome', 'email') do objeto de resposta.
    for (const key in resposta) {
      // 1. Verifica se a chave pertence ao objeto 'resposta' (boa prática).
      // 2. VERIFICAÇÃO PRINCIPAL: Checa se o valor da resposta NÃO é nulo ou indefinido.
      if (Object.prototype.hasOwnProperty.call(resposta, key) && resposta[key] != null) {
        
        // 3. Verifica se o nosso formulário também tem essa chave.
        if (key in vereadorForm) {
          // Atribui o valor da resposta ao campo correspondente no formulário.
          (vereadorForm as any)[key] = resposta[key];
        }
      }
    }

    // Atribuímos o ID do vereador separadamente para garantir que ele seja sempre atualizado.
    this.formCadastro.vereador_id = resposta.id;

    console.log("Formulário preenchido com segurança:", this.formCadastro);
  }

  /**
   * Adriano 18-09-2025
   * Verificando se ja existe algum vereador no sistema caso sim preencheer os campos com as informações desse vereador
   * @param tipo 
   * @returns 
   */
  BuscarVereador(tipo: 'cpf' | 'email'): void {
    const vereador = this.formCadastro.vereador;

    //-- Validação inicial para garantir que os dados necessários existem
    if (!vereador || (tipo === 'email' && !vereador.email) || (tipo === 'cpf' && !vereador.cpf)) {
      console.error(`Dados insuficientes para buscar por ${tipo}.`);
      return;
    }

    //-- Determina qual chamada de serviço será feita
    let busca$: Observable<any>; 
    if (tipo === 'cpf') {
      const cpf = keepOnlyNumbers(vereador.cpf);
      busca$ = this.vereadorService.getVereadorByCpf(cpf);
    } else { // O 'else' aqui cobre o caso 'email'
      busca$ = this.vereadorService.getVereadorByEmail(vereador.email);
    }

    //-- Executa a chamada e centraliza o tratamento da resposta
    busca$.subscribe({
      next: (resposta) => {
        // Chama a função auxiliar para preencher o formulário
        this.preencherDadosVereador(resposta);
      },
      error: (erro) => {
        // Mensagem de erro mais específica
        console.error(`Erro ao buscar vereador por ${tipo}:`, erro);
      }
    });
  }


}
