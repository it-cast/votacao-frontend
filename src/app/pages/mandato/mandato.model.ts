import { CamaraSimple } from "../camara/camara.model";

/**
 * Interface para os dados de um Mandato, como recebido da API.
 * Usado em tabelas e visualizações.
*/
export interface Mandato {
  id: number;
  descricao: string;
  data_inicio: string; 
  data_fim: string;   
  camara_id: number;
  dt_cadastro: string; 
  dt_atualizado: string | null;
  
  // Objeto aninhado da câmara relacionada
  camara: CamaraSimple;

  // Campos de data já formatados pelo backend
  data_inicio_formatada: string;
  data_fim_formatada: string;
  dt_cadastro_formatada: string;
}

/**
 * Interface para a criação ou atualização de um Mandato.
 * Usado nos formulários.
*/
export interface MandatoCreate {
  id?: number | null; // Opcional, usado na edição
  descricao: string;
  data_inicio: string; // O formulário trabalhará com strings no formato YYYY-MM-DD
  data_fim: string;
  camara_id: number | null;
}

/**
 * Interface para a resposta paginada da API de mandatos.
*/
export interface PaginatedMandatoResponse {
  items: Mandato[];
  total: number;
}