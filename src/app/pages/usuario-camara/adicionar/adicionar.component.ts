import { Component } from '@angular/core';

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
import { TreeModule } from 'primeng/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService,MenuItem } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { UsuarioService } from '../../usuario/usuario.service';

import { UsuarioCamaraCreate } from '../usuario-camara.model';
import { PERMISSOES_AGRUPADAS, PermissaoGrupo, PermissaoItem } from '../../../constants/permissoes.constants'
import { USUARIO_ATIVO_OPCOES, UsuarioAtivoStatus, USUARIO_SUPERUSER_OPCOES, UsuarioSuperuserStatus, PAPEIS_NA_CAMARA_OPCOES,PapelNaCamara } from '../../../constants/usuario.constants'
import { UsuarioCamaraService } from '../usuario-camara.service';

export interface Message {
  life: number;
  severity: string;
  content: string;
}

@Component({
  selector: 'app-adicionar',
  imports: [CommonModule,TreeModule, FormsModule,PasswordModule,SelectModule,AccordionModule, ButtonModule, CardModule, BreadcrumbModule, InputTextModule, ToastModule, MessageModule, FloatLabelModule],
  templateUrl: './adicionar.component.html',
  styleUrl: './adicionar.component.scss'
})
export class AdicionarComponent {
    pageTitle             : string        = 'Adicionar';
    currentCamaraId       : number | null = null;
    currentUsuarioCamaraId: number | null = null;
    breadcrumbItems!      : MenuItem[];

   
    public readonly UsuarioAtivoStatus        = UsuarioAtivoStatus;
    public readonly USUARIO_ATIVO_OPCOES      = USUARIO_ATIVO_OPCOES;
    
    public readonly UsuarioSuperuserStatus    = UsuarioSuperuserStatus;
    public readonly USUARIO_SUPERUSER_OPCOES  = USUARIO_SUPERUSER_OPCOES;

    public readonly PapelNaCamara             = PapelNaCamara;
    public readonly PAPEIS_NA_CAMARA_OPCOES   = PAPEIS_NA_CAMARA_OPCOES;


    isLoading : boolean = false;
    active    : number  = 0

    formCadastro: UsuarioCamaraCreate = {
      id: null,
      ativo: UsuarioAtivoStatus.SIM,
      camara_id: 0,
      papel: PapelNaCamara.ADMINISTRATIVO,
      permissao: [],
      usuario: {
        id: null,
        nome: '',
        email: '',
        senha: '',
        confSenha: '',
        ativo: UsuarioAtivoStatus.SIM,
        is_superuser: UsuarioSuperuserStatus.NAO
      }
    }

    permissoes    : PermissaoGrupo[]  = PERMISSOES_AGRUPADAS;
    selectedFiles : PermissaoItem[]   = [];  
    emailBuscar   : string            = '';
    isEditMode    : boolean           = false;

    errorPassword: any = {  
      required: false,
      requiredConf: false,
      divergent: false,
    };

    constructor(
      private messageService: MessageService,
      public router: Router,
      private route: ActivatedRoute,
      private usuarioService: UsuarioService,
      private usuarioCamaraService: UsuarioCamaraService,

    ){}

    ngOnInit(): void {
      this.route.params.subscribe(params => {
        const camaraId = params['camaraId'];
        const id = params['id'];
        if (id) {
          this.currentUsuarioCamaraId = +id;
          this.formCadastro.id = this.currentUsuarioCamaraId;
          this.isEditMode = true;
          this.pageTitle = 'Editar';
          this.loadUsuarioData(this.currentUsuarioCamaraId);
        }

        if (camaraId) {
          this.currentCamaraId = +camaraId;
          this.formCadastro.camara_id = this.currentCamaraId;
        }

        this.breadcrumbItems = [
          { label: 'Início', routerLink: '/' },
          { label: 'Usuarios', routerLink: `/camara/usuarios/${this.currentCamaraId}` },
          { label: this.pageTitle }
        ];

      });
    }

    /**
     * Adriano 15-09-2025
     * Busca o usuário caso ele ja exista na lista de usuarios
    */
    BuscarUsuario(){
      const email = this.formCadastro.usuario.email
      if (email && email.includes('@')) {
        console.log('Saindo do campo de e-mail. Valor:', email);
        
        this.usuarioService.getUsuarioByEmail(email).subscribe({
          next: (resposta) => {
            console.log(resposta);
            this.formCadastro.usuario.nome = resposta.nome;
            this.formCadastro.usuario.email = resposta.email;
            this.formCadastro.usuario.ativo = resposta.ativo;
            this.formCadastro.usuario.is_superuser = resposta.is_superuser;
            this.formCadastro.usuario.id = resposta.id;
            this.formCadastro.usuario_id = resposta.id;
          },
          error: (erro) => {
            console.error('Erro ao verificar e-mail:', erro);
          }
        });
      } else {
        console.log('Campo de e-mail vazio ou inválido. Nenhuma requisição será feita.');
      }  
    }

    /**
     * Adriano 15-09-2025
     * Recupera todas as permissões selecionadas e armazena na variavel selectedFiles
     * @param event 
     * @param checked 
     */
    nodeSelect(event: any, checked: boolean) {
      const allNodes = this.getAllNodes(this.permissoes);
      if (checked) this.selectedFiles = allNodes;
      else this.selectedFiles = [];
    }

    
    /**
     * Adriano 15-09-2025
     * Monta o array de permissões selecionadas
     * @param nodes 
     * @returns 
    */
    getAllNodes(nodes: any[]): any[] {
      let allNodes: any[] = [];

      nodes.forEach((node: any) => {
        //-- Adiciona o nó atual aos nós selecionados
        allNodes.push(node);
        //-- Se o nó tiver filhos, recursivamente adicionar seus filhos
        if (node.children) {
          allNodes = allNodes.concat(this.getAllNodes(node.children));
        }
      });

      return allNodes;
    }

    /**
     * Adriano 15-09-2025
     * Faz a requisição para o backend para retonar o usuário para edição
     * @param id 
     */
    loadUsuarioData(id: number): void {
      this.isLoading = true;
      this.usuarioCamaraService.getCamaraUsuarioById(id).subscribe({
        next: (usuario) => {
          console.log("usuario");
          this.preencherFormularioComFor(usuario);
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
     * Adriano 15-09-2025
     * Preenche o formulário com os dados do backend usando laços 'for' para encurtar o código.
     * @param dados O objeto recebido da sua API.
    */
    preencherFormularioComFor(dados: any): void {
      // 1. Define as chaves que podem ser copiadas diretamente para o formulário principal
      const chavesPrincipais = ['id', 'camara_id', 'papel'];

      for (const chave of chavesPrincipais) {
        // Verifica se a chave existe em ambos os objetos antes de copiar
        if (chave in dados && chave in this.formCadastro) {
          (this.formCadastro as any)[chave] = dados[chave];
        }
      }

      // 2. Define as chaves que podem ser copiadas diretamente para o usuário aninhado
      const chavesUsuario = ['id', 'nome', 'email', 'ativo', 'is_superuser'];

      for (const chave of chavesUsuario) {
        // Verifica se a chave existe em ambos os objetos aninhados antes de copiar
        if (chave in dados.usuario && chave in this.formCadastro.usuario) {
          (this.formCadastro.usuario as any)[chave] = dados.usuario[chave];
        }
      }

      // 3. Trata os casos especiais que não podem ser copiados diretamente
      this.formCadastro.ativo = dados.ativo ? 1 : 0; // Converte boolean para número
      this.formCadastro.permissao = JSON.parse(dados.permissao); // Converte string JSON para array

      this.markTreeNodesByPermissions(this.formCadastro.permissao);

      // 4. Garante que os campos de senha sejam sempre limpos no formulário de edição
      this.formCadastro.usuario.senha = '';
      this.formCadastro.usuario.confSenha = '';
      
      // Para verificar o resultado no console do navegador
      console.log("Formulário preenchido (com for):", this.formCadastro);
    }

    /**
     * Adriano 15-09-2025
     * Marcar todos as permissões do no usuário na tela
     * @param permissions 
     */
    markTreeNodesByPermissions(permissions: string[]) {
      // Inicializa o array selectedFiles com nó raiz
      this.selectedFiles = [];

      // Função recursiva para marcar os nós
      const selectNodeAndParents = (node: any) => {
        // Se o nó está nas permissões, marca como selecionado
        if (permissions.includes(node.data)) {
          this.selectedFiles.push(node);
          // Verificar se o nó tem um pai (caso contrário, ele é a raiz)
          if (node.parent) {
            selectNodeAndParents(node.parent);
          }
        }

        // Se o nó tiver filhos, verifica se todos estão selecionados
        if (node.children && node.children.length > 0) {
          let allSelected = node.children.every((child: any) => permissions.includes(child.data) || this.selectedFiles.includes(child));
          let someSelected = node.children.some((child: any) => permissions.includes(child.data) || this.selectedFiles.includes(child));

          // Se todos os filhos estão selecionados, seleciona o nó pai
          if (allSelected) {
            this.selectedFiles.push(node);
            node.partialSelected = false;  // Garante que o estado indeterminado é removido
          }
          // Se alguns, mas não todos, filhos estão selecionados, marca o nó pai como indeterminado
          else if (someSelected) {
            node.partialSelected = true;
          }
          // Se nenhum filho estiver selecionado, remove o nó pai da seleção
          else {
            node.partialSelected = false;
          }
        }
      };

      // Itera sobre todos os nós e marca os selecionados
      this.getAllNodes(this.permissoes).forEach((node: any) => {
        selectNodeAndParents(node);
      });

      // Garantir que a árvore seja re-renderizada
      setTimeout(() => {
        this.selectedFiles = [...this.selectedFiles];
      }, 0);
    }

    /**
     * Adriano 15-09-2025
     * Salva os dados do usuário no banco
     * @param form 
     * @returns 
     */
    onSubmit(form: NgForm) {
      let data = { ...this.formCadastro };

      if (form.invalid) {
        form.control.markAllAsTouched();
        return;
      }

      data.permissao = [];
      if (this.selectedFiles) {
        let selectFilesChildren = this.selectedFiles.filter((item: any) => item.data)
        selectFilesChildren.forEach((item: any) => {
          data.permissao.push(item.data)
        })
      }

      const operation = this.isEditMode && this.currentUsuarioCamaraId
            ? this.usuarioCamaraService.updateCamaraUsuario(this.currentUsuarioCamaraId, data as UsuarioCamaraCreate)
            : this.usuarioCamaraService.createCamaraUsuario(data as UsuarioCamaraCreate);
      
      operation.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Usuario atualizado com sucesso!' : 'Usuario cadastrada com sucesso!';
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
          
          setTimeout(() => {
            this.router.navigate([`camara/usuarios/${this.currentCamaraId}`]);
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
          this.isLoading = false;
        }
      });
    }
}
