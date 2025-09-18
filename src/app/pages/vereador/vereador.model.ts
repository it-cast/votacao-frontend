/**
 * Interface com as propriedades base de um Vereador.
 */
export interface VereadorBase {
  email: string;
  nome: string;
  telefone: string;
  cpf: string;
  partido: string;
}

/**
 * Interface para a criação de um novo Vereador.
 * Usada em formulários. Corresponde ao primeiro JSON.
 */
export interface VereadorCreate extends VereadorBase {
  id?: number | null;
  ativo?: number;
}

/**
 * Interface completa para o objeto Vereador retornado pela API.
 * Corresponde ao segundo JSON.
 */
export interface Vereador extends VereadorBase {
  id: number;
  ativo: number;
  dt_cadastro: string; 
  dt_atualizado: string; 
}

/**
 * Interface para a resposta paginada da API de vereadores.
 */
export interface PaginatedVereadorResponse {
  items: Vereador[];
  total: number;
}