import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';


import { CamaraService } from '../camara.service';

import { CamaraCreate } from '../camara.model';
import { HeaderButton } from '../../../components/page-header/page-header.model';

import { PageHeaderComponent } from '../../../components/page-header/page-header.component';

import { FormInputComponent} from '../../../components/form-input/form-input.component'
import { FormMaskComponent} from '../../../components/form-mask/form-mask.component'



@Component({
  standalone: true,
  selector: 'app-adicionar-camara',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    BreadcrumbModule,
    InputTextModule,
    ToastModule,
    MessageModule,
    FloatLabelModule,
    InputMaskModule,
    PageHeaderComponent,
    FormInputComponent,
    FormMaskComponent
  ],
  providers: [MessageService],
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss']
})
export class AdicionarComponent implements OnInit {
  
  formCadastro: CamaraCreate = {
    nome: '',
    email: '',
    cnpj: '',
    telefone: '',
    endereco: '',
    municipio: '',
    uf: '',
    numero_cadeiras: 0
  };

  isLoading: boolean = false;
  isEditMode: boolean = false;
  private currentCamaraId: number | null = null;
  pageTitle: string = 'Adicionar';

  breadcrumbItems: MenuItem[] = [];
  headerButtons: HeaderButton[] = [];

  constructor(
    private camaraService: CamaraService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.pageTitle = 'Editar';
        this.currentCamaraId = +id;
        this.loadCamaraData(this.currentCamaraId);
      }
    });

    this.breadcrumbItems = [
      {label:'Início', routerLink: '/'},
      {label:'Câmaras', routerLink: '/camara'},
      {label: this.pageTitle}
    ];

    this.headerButtons = [
      { label: 'Voltar', icon: 'fa-solid fa-arrow-left', link: '/camara' }
    ];
  }

  loadCamaraData(id: number): void {
    this.isLoading = true;
    this.camaraService.getCamaraById(id).subscribe({
      next: (camara) => {
        this.formCadastro = { ...camara };
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Não foi possível carregar os dados da câmara para edição.' 
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

    this.isLoading = true;

    // 3. A LÓGICA PARA REMOVER A MÁSCARA CONTINUA A MESMA
    const payload = this.preparePayload();

    const operation = this.isEditMode && this.currentCamaraId
      ? this.camaraService.updateCamara(this.currentCamaraId, payload)
      : this.camaraService.createCamara(payload as CamaraCreate);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Câmara atualizada com sucesso!' : 'Câmara cadastrada com sucesso!';
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
        
        setTimeout(() => {
          this.router.navigate(['/camara']);
        }, 1500);
      },
      error: (err: any) => {
        const detailMessage = err?.error?.detail || 'Ocorreu um erro desconhecido ao salvar.';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: detailMessage });
        this.isLoading = false;
      }
    });
  }

  /**
   * Cria uma cópia limpa do formulário, removendo caracteres de máscara.
   * Esta função funciona perfeitamente com p-inputMask.
   */
  private preparePayload(): CamaraCreate {
    const payload = { ...this.formCadastro };

    // Remove qualquer coisa que não seja dígito
    if (payload.cnpj) {
      payload.cnpj = String(payload.cnpj).replace(/\D/g, '');
    }
    if (payload.telefone) {
      payload.telefone = String(payload.telefone).replace(/\D/g, '');
    }

    return payload;
  }
}