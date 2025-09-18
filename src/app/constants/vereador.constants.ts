
export enum VeradorAtivoStatus {
  NAO = 0,
  SIM = 1
}

export const VEREADOR_ATIVO_OPCOES = [
  { key: VeradorAtivoStatus.NAO, value: 'Desativado' },
  { key: VeradorAtivoStatus.SIM, value: 'Ativado' },
];



export enum FuncaoNoMandato {
  LEGISLATIVA = 1,
  FISCALIZADORA = 2,
  ASSESSORAMENTO = 3,
  JULGADORA = 4,
}

// Array para exibir os papéis na interface do usuário (UI),
// como em formulários de cadastro ou edição. 
export const FUNCOES_NO_MANDATO_OPCOES = [
  { key: FuncaoNoMandato.LEGISLATIVA,      value: 'Legislativa (Criar Leis)' },
  { key: FuncaoNoMandato.FISCALIZADORA,        value: 'Fiscalizadora (Vigiar o Prefeito)' },
  { key: FuncaoNoMandato.ASSESSORAMENTO,  value: 'Assessoramento (Sugerir Melhorias)' },
  { key: FuncaoNoMandato.JULGADORA,        value: 'Julgadora (Julgar Responsáveis)' },
];

export const FuncaoExibir = (funcao: number): string => { 
  return FUNCOES_NO_MANDATO_OPCOES.find(item => item.key === funcao)?.value || ''
}