export interface Camara {
  id: number;
  nome: string;
  cnpj: string | null;
  email: string;
  telefone: string | null;
  endereco: string | null;
  municipio: string | null;
  uf: string | null;
  numero_cadeiras: number | null;
  dt_cadastro: string; // Mantido como string para simplicidade, pode ser convertido para Date se necessário
  dt_atualizado: string | null;
  excluido: boolean;
  dt_cadastro_formatada: string;
  dt_atualizado_formatada: string | null;
}


export interface CamaraCreate {
  nome: string;
  email: string;
  cnpj?: string;
  telefone?: string;
  endereco?: string;
  municipio?: string;
  uf?: string;
  numero_cadeiras?: number;
}

export interface CamaraSimple {
  id: number;
  nome: string;
}

//-- Adriano 10-09-2025
//-- Crie uma interface para a resposta paginada que você espera do backend
export interface PaginatedCamaraResponse {
  items: Camara[];
  total: number;
}