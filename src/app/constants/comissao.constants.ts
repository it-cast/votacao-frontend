
export enum ComissaoAtivoStatus {
  NAO = 0,
  SIM = 1
}

export const COMISSAO_ATIVA_OPCOES = [
  { key: ComissaoAtivoStatus.NAO, value: 'Desativado' },
  { key: ComissaoAtivoStatus.SIM, value: 'Ativado' },
];