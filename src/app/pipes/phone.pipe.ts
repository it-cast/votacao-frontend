import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone', // Nome que usaremos no template: | phone
  standalone: true, // Padrão moderno do Angular
})
export class PhonePipe implements PipeTransform {

  transform(value: string | number | null | undefined): string {
    // 1. Validação inicial: se o valor for nulo ou indefinido, retorna uma string vazia.
    if (!value) {
      return '';
    }

    // 2. Limpeza: remove tudo que não for dígito.
    // Ex: "+55 (21) 99999-8888" vira "5521999998888"
    // No Brasil, geralmente não precisamos do DDI 55, então vamos removê-lo se estiver presente.
    let cleaned = ('' + value).replace(/\D/g, '');
    if (cleaned.startsWith('55')) {
      cleaned = cleaned.substring(2);
    }
    
    // 3. Aplica a máscara baseada no tamanho do número.
    const length = cleaned.length;

    if (length === 11) {
      // Formato para celular: (XX) XXXXX-XXXX
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
    } else if (length === 10) {
      // Formato para telefone fixo: (XX) XXXX-XXXX
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;
    } else {
      // 4. Se não corresponder a nenhum formato, retorna o número limpo (ou o original).
      // Isso evita quebrar a aplicação com dados inesperados.
      return value.toString();
    }
  }
}