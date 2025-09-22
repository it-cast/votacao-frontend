
export enum ComissaoAtivoStatus {
  NAO = 0,
  SIM = 1
}

export const COMISSAO_ATIVA_OPCOES = [
  { key: ComissaoAtivoStatus.NAO, value: 'Desativado' },
  { key: ComissaoAtivoStatus.SIM, value: 'Ativado' },
];



export enum FuncaoNaComissao {
  PRESIDENTE = 1,
  RELATOR = 2,
  MEMBRO = 3, // Também conhecido como Vogal
}

/**
 * Array de opções para ser usado em componentes de formulário (como p-select),
 * associando cada função a um texto amigável.
 */
export const FUNCOES_NA_COMISSAO_OPCOES = [
  { key: FuncaoNaComissao.PRESIDENTE, value: 'Presidente' },
  { key: FuncaoNaComissao.RELATOR,    value: 'Relator' },
  { key: FuncaoNaComissao.MEMBRO,     value: 'Membro (Vogal)' },
];

/**
 * Função auxiliar para obter o texto de exibição de uma função a partir de seu valor numérico.
 * Útil para exibir a função em tabelas e relatórios.
 * * @param funcao O valor numérico da função (ex: 1, 2, 3).
 * @returns O nome da função (ex: "Presidente") ou uma string vazia se não for encontrado.
 */
export const FuncaoComissaoExibir = (funcao: number): string => { 
  return FUNCOES_NA_COMISSAO_OPCOES.find(item => item.key === funcao)?.value || '';
}