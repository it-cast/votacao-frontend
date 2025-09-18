import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Comissao, ComissaoCreate, PaginatedComissaoResponse } from './comissao.model';

@Injectable({
  providedIn: 'root'
})
export class ComissaoService {

  private endpoint = 'comissoes'; // Endpoint da API para comissões

  constructor(private httpService: HttpService) { }

  /**
   * Busca a lista de comissões de uma câmara de forma paginada.
   * @param skip O número de registros a pular.
   * @param limit O número de registros por página.
   * @param filtro Termo para filtrar pelo nome da comissão.
   * @param idCamara ID da câmara para filtrar os resultados.
  */
  getComissoes(skip: number = 0, limit: number = 10, filtro?: string, idCamara: number | null = null): Observable<PaginatedComissaoResponse> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    if (filtro) {
      params = params.set('filtro', filtro);
    }
    const url = `${this.endpoint}/camara/${idCamara}`;
    
    return this.httpService.get(url, params);
  }

  /**
   * Busca os dados de uma comissão específica pelo ID.
   * @param id O ID da comissão a ser buscada.
   */
  getComissaoById(id: number): Observable<ComissaoCreate> {
    return this.httpService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Envia os dados para criar uma nova comissão na API.
   * @param comissaoData Os dados da comissão a serem cadastrados.
   */
  createComissao(comissaoData: ComissaoCreate): Observable<Comissao> {
    return this.httpService.post(this.endpoint, comissaoData);
  }

  /**
   * Envia os dados para atualizar uma comissão existente.
   * @param id O ID da comissão a ser atualizada.
   * @param comissaoData Os dados da comissão a serem atualizados.
   */
  updateComissao(id: number, comissaoData: ComissaoCreate): Observable<Comissao> {
    return this.httpService.put(`${this.endpoint}/${id}`, comissaoData);
  }

  /**
   * Deleta uma comissão pelo seu ID.
   * @param id O ID da comissão a ser deletada.
   */
  deleteComissao(id: number): Observable<any> {
    return this.httpService.delete(`${this.endpoint}/${id}`);
  }
}
