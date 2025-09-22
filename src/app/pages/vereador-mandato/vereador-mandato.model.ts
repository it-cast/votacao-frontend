import { Vereador, VereadorCreate } from '../vereador/vereador.model';
import { Mandato } from '../mandato/mandato.model';

/**
 * Interface para a resposta paginada da API.
 * Corresponde ao primeiro JSON.
 */
export interface PaginatedMandatoVereadorResponse {
  items: MandatoVereador[];
  total: number;
}

/**
 * Interface completa para um objeto de associação Mandato-Vereador.
 * Representa um item da lista na resposta paginada.
 */
export interface MandatoVereador {
  id: number;
  vereador_id: number;
  mandato_id: number;
  funcao: number;
  vereador: Vereador;
  mandato: Mandato;   
}

/**
 * Interface para criar uma nova associação Mandato-Vereador.
 * Corresponde ao segundo JSON (payload de criação/envio).
 */
export interface MandatoVereadorCreate {
  id?: number | null;
  mandato_id: number | null;
  funcao: number;
  vereador_id?: number | null;       
  vereador?: VereadorCreate ; 
}

/**
 * Interface para o payload de atualização, contendo apenas
 * os dados necessários do vereador.
 */
export interface VereadorInMandatoUpdate {
    id: number;
    email: string;
    nome: string;
    telefone: string;
    cpf: string;
    partido: string;
    ativo: boolean;
}

/**
 * Interface para o payload completo de atualização da associação.
 */
export interface MandatoVereadorUpdate {
    funcao: number;
    vereador: VereadorInMandatoUpdate;
}

export interface PaginatedMandatoVereadorResponse {
  items: MandatoVereador[];
  total: number;

}