import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {urls} from '../../configs/urls';

import {ISave} from '../../interfaces/save';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SavesService {

  constructor(private http:HttpClient) {
  }

  loadGame(slot: string): Observable<ISave> {
    return this.http.get<ISave>(`${urls.saves.load}?slot=${encodeURIComponent(slot)}`);
  }

  saveGame(slot:ISave):Observable<any>{
   return  this.http.post(urls.saves.save, slot)
  }

  getAll():Observable<any>{
    return  this.http.get(urls.saves.getAll)
  }

}
