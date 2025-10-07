import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { VereadorCreate, Vereador, PaginatedVereadorResponse } from './vereador.model'

@Injectable({
  providedIn: 'root'
})
export class VereadorService {

  private endpoint = 'vereadores'; 

  constructor(private httpService: HttpService) { }

  /**
   * Adriano 29-09-2025
   * Retonar os vereadores
   * @param skip 
   * @param limit 
   * @param filtro 
   * @returns 
   */
  getVereadores(skip: number = 0, limit: number = 10, filtro?: string): Observable<PaginatedVereadorResponse>{
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    if (filtro) {
      params = params.set('filtro', filtro);
    }

    return this.httpService.get(this.endpoint, params);
  }

  /**
   * Adriano 17-09-2025
   * Busca os dados de um vereador específica pelo ID.
   * @param id O ID da câmara a ser buscada.
  */
  getVereadorById(id: number): Observable<Vereador> {
    return this.httpService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Adriano 18-09-2025
   * @param cpf 
   * @returns  
   */
  getVereadorByCpf(cpf: string): Observable<Vereador> {
    return this.httpService.get(`${this.endpoint}/cpf/${cpf}`)
  }

  /**
   * Adriano 18-09-2025
   * @param email 
   * @returns 
   */
  getVereadorByEmail(email: string): Observable<Vereador> {
    return this.httpService.get(`${this.endpoint}/email/${email}`)
  }

  /**
   * Adriano 29-09-2025
   * @param vereadorData 
   * @returns 
   */
  createVereador(vereadorData: VereadorCreate): Observable<Vereador> {
    return this.httpService.post(this.endpoint, vereadorData);
  }

  /**
   * 
   * @param id 
   * @param vereadorData 
   * @returns 
   */
  updateVereador(id: number, vereadorData: VereadorCreate): Observable<Vereador> {
    return this.httpService.put(`${this.endpoint}/${id}`, vereadorData);
  }
 
}
