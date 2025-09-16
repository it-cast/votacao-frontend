import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { Camara, CamaraCreate } from './camara.model';
import { HttpParams } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  private endpoint = 'camaras'; // Centraliza o nome do endpoint para facilitar a manutenção

  constructor(private httpService: HttpService) { }

  /**
   * Busca a lista de câmaras de forma paginada.
   * @param skip O número de registros a pular (para a página atual).
   * @param limit O número de registros por página.
  */
    getCamaras(skip: number = 0, limit: number = 10, filtro?: string): Observable<Camara[]> {
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
   * Busca os dados de uma câmara específica pelo ID.
   * @param id O ID da câmara a ser buscada.
   */
  getCamaraById(id: number): Observable<CamaraCreate> {
    return this.httpService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Envia os dados para criar uma nova câmara na API.
   * @param camaraData Os dados da câmara a serem cadastrados.
   */
  createCamara(camaraData: CamaraCreate): Observable<Camara> {
    return this.httpService.post(this.endpoint, camaraData);
  }

  /**
   * Envia os dados para atualizar uma câmara existente.
   * @param id O ID da câmara a ser atualizada.
   * @param camaraData Os dados da câmara a serem atualizados.
   */
  updateCamara(id: number, camaraData: CamaraCreate): Observable<Camara> {
    return this.httpService.put(`${this.endpoint}/${id}`, camaraData);
  }

  /**
   * Adriano 15-09-2025
   * Deletar uma câmara
   * @param id 
   * @returns 
   */
  deleteCamara(id: number): Observable<any> {
    return this.httpService.delete(`${this.endpoint}/${id}`);
  }

}