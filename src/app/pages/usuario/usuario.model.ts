export interface Usuario {
  id: number;
  nome: string;
  email: string;
  ativo: number;
  dt_cadastro: string; 
  dt_atualizado: string | null;
  dt_cadastro_formatada: string;
  dt_atualizado_formatada: string | null;
}


export interface UsuarioCreate {
  id?: number | null;
  nome: string;
  email: string;
  senha?: string;
  confSenha?: string;
  ativo?: number;
  is_superuser?: number;
}

//-- Adriano 10-09-2025
//-- Crie uma interface para a resposta paginada que você espera do backend
export interface PaginatedUsuarioResponse {
  items: Usuario[];
  total: number;
}