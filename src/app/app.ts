import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgcCookieConsentService} from 'ngx-cookieconsent';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy{
  protected readonly title = signal('MazeRunnerGame');
  private statusChangeSubscription!: Subscription;

  constructor(private ccService: NgcCookieConsentService) {}

  ngOnInit() {
    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event) => {

      }
    );
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }



}
