import { Component, Input, forwardRef, OnInit, Injector, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, FormsModule } from '@angular/forms';

// Imports do PrimeNG
import { InputMaskModule } from 'primeng/inputmask';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-form-mask',
  standalone: true,
  imports: [FormsModule, InputMaskModule, MessageModule],
  templateUrl: './form-mask.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormMaskComponent),
      multi: true
    }
  ]
})
export class FormMaskComponent implements ControlValueAccessor, OnInit {

  @Input() label: string = '';
  @Input() name: string = '';
  @Input() mask: string = ''; // Input para a máscara (ex: '99.999.999/9999-99')
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  @Output() blurEvent = new EventEmitter<void>();
  
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


  onBlur() {
    this.onTouched();
    this.blurEvent.emit(); // <<< REPASSA O EVENTO PRO PAI
  }
}