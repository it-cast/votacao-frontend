import { UsuarioCreate, Usuario } from '../usuario/usuario.model';
import { Camara } from '../camara/camara.model';
import { Vereador } from '../vereador/vereador.model';


export interface UsuarioCamaraCreate {
  id?: number | null;
  usuario_id?: number | null;
  vereador_id?: number | null;
  camara_id: number;
  papel: number;
  permissao: string[];
  ativo: number;
  usuario: UsuarioCreate;
}

export interface UsuarioCamara {
  id: number;
  usuario_id: number;
  camara_id: number;
  papel: number;
  permissao: string;
}


// Interface completa para o objeto UsuarioCamara
export interface UsuarioCamara {
  id: number;
  usuario_id: number;
  camara_id: number;
  papel: number;
  papel_desc: string;
  vereador_nome?: string;
  permissao: string;
  ativo: number;
  usuario: Usuario;
  camara: Camara;
  vereador_id: number;
  vereador: Vereador;

}