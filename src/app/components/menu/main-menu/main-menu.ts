import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-menu',
  imports: [],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css'
})
export class MainMenu {


  constructor(private router:Router) {
  }

  redirectTo(menuCredits: string) {
    this.router.navigateByUrl(menuCredits)
  }
}
