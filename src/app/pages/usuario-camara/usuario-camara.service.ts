import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { UsuarioCamara, UsuarioCamaraCreate } from './usuario-camara.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioCamaraService {

    private endpoint = 'usuario-camara'; // Centraliza o nome do endpoint para facilitar a manutenção

  constructor(private httpService: HttpService) { }

  /**
   * Adriano 11-09-2025
   * Busca a lista de usuarios de uma determinada câmara.
   * @param skip O número de registros a pular (para a página atual).
   * @param limit O número de registros por página.
  */
    getCamaraUsuarios(skip: number = 0, limit: number = 10, filtro?: string, idCamara: number | null = null): Observable<UsuarioCamara[]> {
      // Usa HttpParams para adicionar os parâmetros de forma segura na URL
      let params = new HttpParams()
        .set('skip', skip.toString())
        .set('limit', limit.toString());

      if (filtro) {
        params = params.set('filtro', filtro);
      }

      let endpoint = `${this.endpoint}/camara/${idCamara}`;

    // Espera que o backend retorne um objeto com 'items' e 'total'
    return this.httpService.get(endpoint, params );
  }


  /**
   * Adriano 11-09-2025
   * Busca os dados de um usuario da câmara específica pelo ID.
   * @param id O ID da câmara a ser buscada.
  */
  getCamaraUsuarioById(id: number): Observable<UsuarioCamaraCreate> {
    return this.httpService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Adriano 11-09-2025
   * Envia os dados para criar uma novo usuario na API.
   * @param usuarioData Os dados da câmara a serem cadastrados.
  */
  createCamaraUsuario(usuarioData: UsuarioCamaraCreate): Observable<UsuarioCamara> {
    return this.httpService.post(this.endpoint, usuarioData);
  }

  /**
   * Adriano 11-09-2025
   * Envia os dados para atualizar um usuario existente.
   * @param id O ID da câmara a ser atualizada.
   * @param usuarioData Os dados da câmara a serem atualizados.
  */
  updateCamaraUsuario(id: number, usuarioData: UsuarioCamaraCreate): Observable<UsuarioCamara> {
    return this.httpService.put(`${this.endpoint}/${id}`, usuarioData);
  }

  /**
   * Adriano 15-09-2025
   * Deletar um usuário da câmara
   * @param id 
   * @returns 
   */
  deleteCamaraUsuario(id: number): Observable<any> {
    return this.httpService.delete(`${this.endpoint}/${id}`);
  }
}
