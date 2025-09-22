import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs/internal/Observable';
import { HttpParams } from '@angular/common/http';

import { ComissaoMembro, ComissaoMembroCreate, PaginatedComissaoMembroResponse } from './comissao-membro.model';


@Injectable({
  providedIn: 'root'
})
export class ComissaoMembroService {
    private endpoint = 'comissao-membros';

  constructor(private httpService: HttpService) { }

  /**
   * Busca a lista de vereadores pertencentes ao mandato ativo de uma câmara.
   * @param camaraId O ID da câmara.
   */
  getVereadoresAtivosPorCamara(camaraId: number): Observable<any> {
    // Constrói os parâmetros da query de forma segura
    const params = new HttpParams()
      .set('camara_id', camaraId.toString())
      .set('mandato_ativo', 'true')

    // O endpoint agora é o genérico de 'mandato-vereador'
    return this.httpService.get('mandato-vereador', params);
  }


  /**
   * Busca a lista de membros de forma paginada.
   * @param skip O número de registros a pular (para a página atual).
   * @param limit O número de registros por página.
  */
    getComissoes(skip: number = 0, limit: number = 10, filtro?: string, idComissao: number | null = null): Observable<PaginatedComissaoMembroResponse> {
      // Usa HttpParams para adicionar os parâmetros de forma segura na URL
      let params = new HttpParams()
        .set('skip', skip.toString())
        .set('limit', limit.toString());

      if (filtro) {
        params = params.set('filtro', filtro);
      }

      let endpoint = `${this.endpoint}/comissao/${idComissao}`;

    // Espera que o backend retorne um objeto com 'items' e 'total'
    return this.httpService.get(endpoint, params );
  }


  /**
   * Busca os dados de um membro específica pelo ID.
   * @param id 
   */
  getComissaoMembroById(id: number): Observable<ComissaoMembro> {
    return this.httpService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Envia os dados para criar uma novo membro na API.
   * @param data 
   */
  createComissaoMembro(data: ComissaoMembroCreate): Observable<ComissaoMembro> {
    return this.httpService.post(this.endpoint, data);
  }

  /**
   * Envia os dados para atualizar um membro existente.
   * @param id 
   * @param data 
   */
  updateComissaoMembro(id: number, data: ComissaoMembroCreate): Observable<ComissaoMembro> {
    return this.httpService.put(`${this.endpoint}/${id}`, data);
  }

  /**
   * Adriano 15-09-2025
   * Deletar um membro
   * @param id 
   * @returns 
   */
  deleteComissaoMembro(id: number): Observable<any> {
    return this.httpService.delete(`${this.endpoint}/${id}`);
  }
}
