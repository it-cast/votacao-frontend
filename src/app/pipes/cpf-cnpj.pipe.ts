import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfCnpj'
})
export class CpfCnpjPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    value = value.replace(/\D/g, '');

    if (value.length === 11) {
      // CPF (XXX.XXX.XXX-XX)
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length === 14) {
      // CNPJ (XX.XXX.XXX/XXXX-XX)
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
      return value;
    }
  }

}
