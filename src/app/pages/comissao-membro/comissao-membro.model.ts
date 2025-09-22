import { Comissao } from "../comissao/comissao.model";
import { MandatoVereador } from "../vereador-mandato/vereador-mandato.model";

export interface ComissaoMembroCreate {
    id?: number | null;
    funcao: number;
    comissao_id: number | null;
    mandato_vereador_id: number | null;
    data_inicio: string;
    data_fim: string;
}

export interface ComissaoMembro {
  id: number;
  funcao: number;
  data_inicio: string;
  data_fim: string;
  comissao_id: number;
  mandato_vereador_id: number;
  dt_cadastro: string;

  // Campos formatados
  data_inicio_formatada: string;
  data_fim_formatada: string;
  dt_cadastro_formatada: string;
  
  // Objetos aninhados que contêm os detalhes das relações
  comissao: Comissao;
  mandato_vereador: MandatoVereador;
}

export interface PaginatedComissaoMembroResponse {
  items: ComissaoMembro[];
  total: number;
}


