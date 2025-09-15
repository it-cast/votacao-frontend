import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appCpfCnpjValidator]',
  standalone: true,
  // Registra nossa diretiva como um validador customizado para o Angular Forms
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CpfCnpjValidatorDirective),
    multi: true
  }]
})
export class CpfCnpjValidatorDirective implements Validator {

  constructor() { }

  // Esta é a função que o Angular chamará para validar o campo
  validate(control: AbstractControl): ValidationErrors | null {
    // Se o campo estiver vazio, não fazemos nada. A validação 'required' cuidará disso.
    if (!control.value) {
      return null;
    }

    // 1. Limpa o valor, removendo a máscara
    const valorLimpo = (control.value as string).replace(/\D/g, '');

    // 2. Verifica as regras de comprimento
    if (valorLimpo.length > 0 && valorLimpo.length < 11) {
      // Se começou a digitar mas não completou um CPF
      return { 'cpfIncompleto': true };
    }

    if (valorLimpo.length > 11 && valorLimpo.length < 14) {
      // Se passou de um CPF mas não completou um CNPJ
      return { 'cnpjIncompleto': true };
    }

    // 3. Se o comprimento for 0, 11 ou 14, a validação de *comprimento* passa.
    return null; // Retornar null significa que o campo é válido
  }
}