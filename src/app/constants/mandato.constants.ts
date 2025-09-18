
export enum MandatoAtivoStatus {
  NAO = 0,
  SIM = 1
}

export const MANDATO_ATIVO_OPCOES = [
  { key: MandatoAtivoStatus.NAO, value: 'Desativado' },
  { key: MandatoAtivoStatus.SIM, value: 'Ativado' },
];