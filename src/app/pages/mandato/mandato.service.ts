import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Mandato, MandatoCreate } from './mandato.model';

@Injectable({
  providedIn: 'root'
})
export class MandatoService {

  private endpoint = 'mandatos'; // Centraliza o nome do endpoint para facilitar a manutenção
  
  constructor(private httpService: HttpService) { }

  /**
   * Busca a lista de mandatos de uma camara de forma paginada.
   * @param skip O número de registros a pular (para a página atual).
   * @param limit O número de registros por página.
  */
  getMandatos(skip: number = 0, limit: number = 10, filtro?: string, idCamara: number | null = null): Observable<Mandato[]> {
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
   * Busca os dados de um mandato específica pelo ID.
   * @param id O ID da câmara a ser buscada.
   */
  getMadatoById(id: number): Observable<MandatoCreate> {
    return this.httpService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Envia os dados para criar uma novo mandato na API.
   * @param camaraData Os dados da câmara a serem cadastrados.
   */
  createMandato(camaraData: MandatoCreate): Observable<Mandato> {
    return this.httpService.post(this.endpoint, camaraData);
  }

  /**
   * Envia os dados para atualizar um mandato existente.
   * @param id O ID da câmara a ser atualizada.
   * @param camaraData Os dados da câmara a serem atualizados.
   */
  updateMandato(id: number, camaraData: MandatoCreate): Observable<Mandato> {
    return this.httpService.put(`${this.endpoint}/${id}`, camaraData);
  }

  /**
   * Adriano 15-09-2025
   * Deletar um mandato
   * @param id 
   * @returns 
   */
  deleteMandato(id: number): Observable<any> {
    return this.httpService.delete(`${this.endpoint}/${id}`);
  }

}
