import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfCnpjMask]',
  standalone: true, // <-- PASSO MAIS IMPORTANTE!
})
export class CpfCnpjMaskDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    let valorLimpo = value.replace(/\D/g, '');
    let valorFormatado = '';

    if (valorLimpo.length > 11) {
      // CNPJ
      valorLimpo = valorLimpo.substring(0, 14);
      valorFormatado = valorLimpo.replace(/^(\d{2})(\d)/, '$1.$2');
      valorFormatado = valorFormatado.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      valorFormatado = valorFormatado.replace(/\.(\d{3})\.(\d{3})(\d)/, '.$1.$2/$3');
      valorFormatado = valorFormatado.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // CPF
      valorLimpo = valorLimpo.substring(0, 11);
      valorFormatado = valorLimpo.replace(/(\d{3})(\d)/, '$1.$2');
      valorFormatado = valorFormatado.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      valorFormatado = valorFormatado.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }

    this.ngControl.control?.setValue(valorFormatado, { emitEvent: false });
  }
}