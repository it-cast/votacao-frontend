/**
 * Interface para os dados de uma Comissão, como recebido da API.
 * Usado em tabelas e visualizações.
*/
export interface Comissao {
  id: number;
  nome: string;
  ativa: boolean;
  data_inicio: string; // Representa um objeto DateTime do backend
  data_fim: string | null; // Representa um objeto DateTime do backend
  camara_id: number;
  dt_cadastro: string; // Representa um objeto DateTime do backend

  data_inicio_formatada?: string;
  data_fim_formatada?: string | null;
  dt_cadastro_formatada?: string;
  ativa_desc?: string;
}

/**
 * Interface para a criação ou atualização de uma Comissão.
 * Usado nos formulários.
*/
export interface ComissaoCreate {
  id?: number | null; // Opcional, usado na edição
  nome: string;
  ativa: number;
  data_inicio: string; // O formulário trabalhará com strings no formato YYYY-MM-DDTHH:mm
  data_fim: string | null;
  camara_id: number | null;
}

/**
 * Interface para a resposta paginada da API de comissões.
*/
export interface PaginatedComissaoResponse {
  items: Comissao[];
  total: number;
}
