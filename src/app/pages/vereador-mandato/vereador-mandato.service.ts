import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MandatoVereador, MandatoVereadorCreate, MandatoVereadorUpdate } from './vereador-mandato.model'

@Injectable({
  providedIn: 'root'
})
export class VereadorMandatoService {

  private endpoint = 'mandato-vereador'; 

  constructor(private httpService: HttpService) { }

  /**
   * Adriano 17-09-2025
   * Buscar os vereadores 
   * @param skip O número de registros a pular (para a página atual).
   * @param limit O número de registros por página.
  */
    getVereadorMandato(skip: number = 0, limit: number = 10, filtro?: string, idMandato: number | null = null): Observable<MandatoVereador[]> {
      // Usa HttpParams para adicionar os parâmetros de forma segura na URL
      let params = new HttpParams()
        .set('skip', skip.toString())
        .set('limit', limit.toString());

      if (filtro) {
        params = params.set('filtro', filtro);
      }

      let endpoint = `${this.endpoint}/mandato/${idMandato}`;

    // Espera que o backend retorne um objeto com 'items' e 'total'
    return this.httpService.get(endpoint, params );
  }


  /**
   * Adriano 17-09-2025
   * Busca os dados de um vereador específica pelo ID.
   * @param id O ID da câmara a ser buscada.
  */
  getVereadorMandatoById(id: number): Observable<MandatoVereadorCreate> {
    return this.httpService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Adriano 17-09-2025
   * Envia os dados para criar uma novo vereador na API.
   * @param vereadorData Os dados da câmara a serem cadastrados.
  */
  createVereadorMandato(vereadorData: MandatoVereadorCreate): Observable<MandatoVereador> {
    return this.httpService.post(this.endpoint, vereadorData);
  }

  /**
   * Adriano 17-09-2025
   * Envia os dados para atualizar um vereador existente.
   * @param id O ID da câmara a ser atualizada.
   * @param vereadorData Os dados do vereador a serem atualizados.
  */
  updateVereadorMandato(id: number, vereadorData: MandatoVereadorCreate): Observable<MandatoVereador> {
    return this.httpService.put(`${this.endpoint}/${id}`, vereadorData);
  }

  /**
   * Adriano 17-09-2025
   * Deletar um vereador da câmara
   * @param id 
   * @returns 
   */
  deleteVereadorMandato(id: number): Observable<any> {
    return this.httpService.delete(`${this.endpoint}/${id}`);
  }
}
