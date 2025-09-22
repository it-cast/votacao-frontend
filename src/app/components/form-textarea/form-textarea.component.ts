import { Component, Input, forwardRef, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, FormsModule } from '@angular/forms';

// Imports do PrimeNG
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [FormsModule, TextareaModule, MessageModule],
  templateUrl: './form-textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextareaComponent),
      multi: true
    }
  ]
})
export class FormTextareaComponent implements ControlValueAccessor, OnInit {
  // --- Inputs para configurar o componente ---
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() rows: number = 5; // Valor padrão de linhas
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  
  value: any;
  isDisabled: boolean = false;
  ngControl: NgControl | null = null;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
  }

  writeValue(value: any): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }
}
