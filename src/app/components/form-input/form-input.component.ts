import { Component, Input, forwardRef, OnInit, Injector } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, FormsModule } from '@angular/forms';

// Imports do PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [FormsModule, InputTextModule, MessageModule],
  templateUrl: './form-input.component.html',
  // provider para conectar nosso componente ao sistema de formulários do Angular
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor, OnInit {
  // --- Entradas (Inputs) para configurar o componente ---
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() type: 'text' | 'datetime-local' | 'email' | 'number' | 'tel' | 'url' | 'date' | 'password' = 'text';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  
  // Propriedade para armazenar o valor interno do input
  value: any;
  // Propriedade para controlar o estado de desabilitado
  isDisabled: boolean = false;
  // Referência ao controle do formulário para verificar o estado de validação
  ngControl: NgControl | null = null;

  // --- Funções obrigatórias da interface ControlValueAccessor ---
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    // Injetamos o NgControl manualmente para evitar dependência cíclica
    this.ngControl = this.injector.get(NgControl, null);
  }

  // Chamado quando o valor do formulário é definido externamente (ex: ao carregar dados para edição)
  writeValue(value: any): void {
    this.value = value;
  }

  // Registra a função que será chamada quando o valor do nosso input interno mudar
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registra a função que será chamada quando o input perder o foco (evento blur)
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Chamado quando o controle do formulário é desabilitado/habilitado
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}