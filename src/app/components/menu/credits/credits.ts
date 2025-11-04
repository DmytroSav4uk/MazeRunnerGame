import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-credits',
  imports: [],
  templateUrl: './credits.html',
  styleUrl: './credits.css'
})
export class Credits {

  constructor(private router: Router) {
  }


  redirectTo(whereTo: string) {
    this.router.navigateByUrl(whereTo)
  }
}
