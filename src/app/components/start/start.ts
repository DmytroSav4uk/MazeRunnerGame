import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-start',
  imports: [],
  templateUrl: './start.html',
  styleUrl: './start.css'
})
export class Start {


  constructor(private router:Router) {
  }

  start() {
    this.router.navigateByUrl('menu')
  }
}
