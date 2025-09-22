import { Component, Input, forwardRef, Injector, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Imports do PrimeNG
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, MessageModule],
  templateUrl: './form-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    }
  ]
})
export class FormSelectComponent implements ControlValueAccessor, OnInit {
  // --- Entradas (Inputs) para configurar o componente ---
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() options: any[] = []; // Array de opções para o dropdown
  @Input() optionLabel: string = 'value'; // Propriedade do objeto a ser exibida
  @Input() optionValue: string = 'key'; // Propriedade do objeto a ser usada como valor
  @Input() required: boolean = false;
  @Input() placeholder: string = 'Selecione...';

  value: any;
  isDisabled: boolean = false;
  ngControl: NgControl | null = null;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}