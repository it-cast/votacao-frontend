// src/app/pages/comissao/adicionar-membro/adicionar-membro.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, MenuItem } from 'primeng/api';

// Módulos PrimeNG e Componentes Customizados
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { FormSelectComponent } from '../../../components/form-select/form-select.component';
import { FormInputComponent } from '../../../components/form-input/form-input.component';

// Serviços e Modelos
import { ComissaoMembroService } from '../comissao-membro.service';
import { AuthService, Camara } from '../../../services/auth.service';
import { ComissaoMembroCreate } from '../comissao-membro.model';
import { MandatoVereador } from '../../vereador-mandato/vereador-mandato.model';
import { HeaderButton } from '../../../components/page-header/page-header.model';
import { FUNCOES_NA_COMISSAO_OPCOES, FuncaoNaComissao } from '../../../constants/comissao.constants';

@Component({
  selector: 'app-adicionar',
  imports: [ToastModule, CommonModule, FormsModule, CardModule, ButtonModule, PageHeaderComponent, FormSelectComponent, FormInputComponent],
  templateUrl: './adicionar.component.html',
  styleUrl: './adicionar.component.scss'
})
export class AdicionarComponent {
  public readonly FUNCOES_NA_COMISSAO_OPCOES = FUNCOES_NA_COMISSAO_OPCOES;

  formCadastro: ComissaoMembroCreate = {
    funcao: FuncaoNaComissao.MEMBRO,
    data_inicio: '',
    data_fim: '',
    comissao_id: null,
    mandato_vereador_id: null
  };

  vereadoresDisponiveis: MandatoVereador[] = [];
  isLoading = false;
  isEditMode = false;
  pageTitle = 'Adicionar';
  currentComissaoId: number | null = null;
  currentMembroId: number | null = null;
  camara: Camara | null = null;

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  
  constructor(
    private comissaoMembroService: ComissaoMembroService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.camara = this.authService.getSelectedCamara();
    
    this.route.params.subscribe(params => {
      this.currentComissaoId = +params['comissaoId'];
      this.currentMembroId = +params['id'];

      this.formCadastro.comissao_id = this.currentComissaoId;
      this.loadVereadores();

      if (this.currentMembroId) {
        this.isEditMode = true;
        this.pageTitle = 'Editar';
        this.loadMembroData(this.currentMembroId);
      }
    });
    
    this.setupPageHeader();
  }

  setupPageHeader(): void {
    const comissaoMembrosUrl = `/comissao/membros/${this.currentComissaoId}`;
    this.breadcrumbItems = [
        { label: 'Início', routerLink: '/' },
        { label: 'Comissões', routerLink: '/comissao' },
        { label: 'Membros', routerLink: comissaoMembrosUrl },
        { label: this.pageTitle }
    ];
    this.headerButtons = [
        { label: 'Voltar', icon: 'fa-solid fa-arrow-left', link: comissaoMembrosUrl }
    ];
  }

  loadVereadores(): void {
    if (!this.camara?.id) return;
    
    this.isLoading = true;
    this.comissaoMembroService.getVereadoresAtivosPorCamara(this.camara.id).subscribe({
      next: (response) => {
        this.vereadoresDisponiveis = response;
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar a lista de vereadores.' });
        this.isLoading = false;
      }
    });
  }

  loadMembroData(id: number): void {
    this.isLoading = true;
    this.comissaoMembroService.getComissaoMembroById(id).subscribe({
      next: (data) => {
        // Pega apenas os campos necessários para o formulário
        this.formCadastro = {
          id: data.id,
          funcao: data.funcao,
          data_inicio: data.data_inicio, // A API deve retornar no formato 'YYYY-MM-DD'
          data_fim: data.data_fim,       // A API deve retornar no formato 'YYYY-MM-DD'
          comissao_id: data.comissao_id,
          mandato_vereador_id: data.mandato_vereador_id,
        };
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados do membro.' });
        this.isLoading = false;
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    this.isLoading = true;
    const operation = this.isEditMode && this.currentMembroId
      ? this.comissaoMembroService.updateComissaoMembro(this.currentMembroId, this.formCadastro)
      : this.comissaoMembroService.createComissaoMembro(this.formCadastro);

    operation.subscribe({
        next: () => {
            const message = this.isEditMode ? 'Membro atualizado com sucesso!' : 'Membro adicionado com sucesso!';
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
            setTimeout(() => {
                this.router.navigate([`/comissao/membros/${this.currentComissaoId}`]);
            }, 1500);
        },
        error: (err) => {
            this.isLoading = false;
            const detailMessage = err.error?.detail || 'Ocorreu um erro ao salvar.';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: detailMessage });
        }
    });
  }
}
