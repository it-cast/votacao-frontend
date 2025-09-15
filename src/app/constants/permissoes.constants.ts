/**
 * Interface para uma permissão individual.
 * @param label - O nome amigável da permissão (ex: 'Listar').
 * @param data - O valor único que será salvo no banco de dados (ex: 'servico-listar').
 */
export interface PermissaoItem {
  label: string;
  data: string;
}

/**
 * Interface para um grupo de permissões.
 * @param label - O nome da categoria (ex: 'Serviço').
 * @param children - Um array de permissões individuais.
 */
export interface PermissaoGrupo {
  label: string;
  children: PermissaoItem[];
}

/**
 * A constante principal que contém a estrutura de permissões agrupadas.
 * Esta estrutura é ideal para ser usada na construção de formulários
 * e componentes visuais que exibem as permissões.
 */
export const PERMISSOES_AGRUPADAS: PermissaoGrupo[] = [
  {
    label: 'Vereadores',
    children: [
      { label: 'Listar', data: 'vereador-listar' },
      { label: 'Editar', data: 'vereador-editar' },
      { label: 'Criar',  data: 'vereador-criar'  },
      { label: 'Excluir',data: 'vereador-excluir'},
    ]
  },
  {
    label: 'Comissões',
    children: [
      { label: 'Listar', data: 'comissao-listar' },
      { label: 'Editar', data: 'comissao-editar' },
      { label: 'Criar',  data: 'comissao-criar'  },
      { label: 'Excluir',data: 'comissao-excluir'},
    ]
  },
  {
    label: 'Mandatos',
    children: [
        { label: 'Listar', data: 'mandato-listar' },
        { label: 'Editar', data: 'mandato-editar' },
        { label: 'Criar',  data: 'mandato-criar'  },
        { label: 'Excluir',data: 'mandato-excluir'},
    ]
  },
  {
    label: 'Usuários',
    children: [
        { label: 'Listar', data: 'usuario-listar' },
        { label: 'Editar', data: 'usuario-editar' },
        { label: 'Criar',  data: 'usuario-criar'  },
        { label: 'Excluir',data: 'usuario-excluir'},
    ]
  }
];

/**
 * (Opcional, mas muito útil)
 * Extrai todos os valores de 'data' da constante acima para criar um tipo de união.
 * Isso oferece segurança de tipo em todo o seu aplicativo.
 * Exemplo de uso: let minhaPermissao: TipoPermissao = 'servico-listar'; // O TypeScript valida isso!
 */
type ExtrairPermissoes<T extends readonly PermissaoGrupo[]> = T[number]['children'][number]['data'];
export type TipoPermissao = ExtrairPermissoes<typeof PERMISSOES_AGRUPADAS>;