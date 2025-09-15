// Enum para os valores de 'ativo'
export enum UsuarioAtivoStatus {
  NAO = 0,
  SIM = 1
}
//-- Array para exibir 'ativo' na UI (ex: em tabelas, dropdowns)
export const USUARIO_ATIVO_OPCOES = [
  { key: UsuarioAtivoStatus.NAO, value: 'Desativado' },
  { key: UsuarioAtivoStatus.SIM, value: 'Ativado' },
];


//-- Enum para os valores de 'superuser'
export enum UsuarioSuperuserStatus {
  NAO = 0,
  SIM = 1
}
//-- Array para exibir 'superuser' na UI
export const USUARIO_SUPERUSER_OPCOES = [
  { key: UsuarioSuperuserStatus.NAO, value: 'Não' },
  { key: UsuarioSuperuserStatus.SIM, value: 'Sim' },
];


export enum PapelNaCamara {
  PRESIDENTE = 1,
  VEREADOR = 2,
  ASSESSOR = 3,
  ADMINISTRATIVO = 4,
}

// Array para exibir os papéis na interface do usuário (UI),
// como em formulários de cadastro ou edição. 
export const PAPEIS_NA_CAMARA_OPCOES = [
  { key: PapelNaCamara.PRESIDENTE,      value: 'Presidente' },
  { key: PapelNaCamara.VEREADOR,        value: 'Vereador(a)' },
  { key: PapelNaCamara.ADMINISTRATIVO,  value: 'Secretário(a)/Administrativo' },
  { key: PapelNaCamara.ASSESSOR,        value: 'Assessor(a) Parlamentar' },
];