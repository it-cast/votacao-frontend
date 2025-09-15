import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { Usuario, UsuarioCreate } from './usuario.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  ATIVO_NAO = 0
  ATIVO_SIM = 1
  ATIVO: any = [
    { key: 0, value: 'Desativado' },
    { key: 1, value: 'Ativado' },
  ]

  SUPERUSER_NAO = 0
  SUPERUSER_SIM = 1
  SUPERUSER: any = [
    { key: 0, value: 'Não' },
    { key: 1, value: 'Sim' },
  ]
  
  private endpoint = 'usuarios'; // Centraliza o nome do endpoint para facilitar a manutenção

  constructor(private httpService: HttpService) { }

  /**
   * Adriano 10-09-2025
   * Busca a lista de usuarios de uma determinada.
   * @param skip O número de registros a pular (para a página atual).
   * @param limit O número de registros por página.
  */
    getUsuarios(skip: number = 0, limit: number = 10, filtro?: string): Observable<Usuario[]> {
      // Usa HttpParams para adicionar os parâmetros de forma segura na URL
      let params = new HttpParams()
        .set('skip', skip.toString())
        .set('limit', limit.toString());

      if (filtro) {
        params = params.set('filtro', filtro);
      }
    // Espera que o backend retorne um objeto com 'items' e 'total'
    return this.httpService.get(this.endpoint, params );
  }


  /**
   * Adriano 10-09-2025
   * Busca os dados de um usuario específica pelo ID.
   * @param id O ID da câmara a ser buscada.
  */
  getUsuarioById(id: number): Observable<UsuarioCreate> {
    return this.httpService.get(`${this.endpoint}/${id}`);
  }

  getUsuarioByEmail(email: string): Observable<UsuarioCreate> {
    return this.httpService.get(`${this.endpoint}/email/${email}`);
  }

  /**
   * Adriano 10-09-2025
   * Envia os dados para criar uma novo usuario na API.
   * @param usuarioData Os dados da câmara a serem cadastrados.
  */
  createUsuario(usuarioData: UsuarioCreate): Observable<Usuario> {
    return this.httpService.post(this.endpoint, usuarioData);
  }

  /**
   * Adriano 10-09-2025
   * Envia os dados para atualizar um usuario existente.
   * @param id O ID da câmara a ser atualizada.
   * @param usuarioData Os dados da câmara a serem atualizados.
  */
  updateUsuario(id: number, usuarioData: UsuarioCreate): Observable<Usuario> {
    return this.httpService.put(`${this.endpoint}/${id}`, usuarioData);
  }
}
