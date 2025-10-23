import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ISettings, } from '../../interfaces/settings';


@Injectable({
  providedIn: 'root'
})
export class PublicFunctions {

  constructor(private router: Router) {
  }

  redirectTo(whereto: string) {
    this.router.navigateByUrl(whereto)
  }

  getLocalStorage(key: string): ISettings | null {
    const obj = localStorage.getItem(key);
    if (!obj) return null;

    try {
      return JSON.parse(obj) as ISettings;
    } catch {
      return null;
    }
  }

  setLocalStorage(key: string, obj: any) {
    localStorage.setItem(key, JSON.stringify(obj))
  }

}
