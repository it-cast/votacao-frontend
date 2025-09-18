import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { VereadorCreate, Vereador } from './vereador.model'

@Injectable({
  providedIn: 'root'
})
export class VereadorService {

  private endpoint = 'vereadores'; 

  constructor(private httpService: HttpService) { }

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
 
}
