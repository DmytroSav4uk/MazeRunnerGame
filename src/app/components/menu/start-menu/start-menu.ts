import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MusicService} from '../../../services/music/music';


@Component({
  selector: 'app-start-menu',
  imports: [
    RouterOutlet
  ],
  templateUrl: './start-menu.html',
  styleUrl: './start-menu.css'
})
export class StartMenu implements OnInit, OnDestroy{


  constructor(private musicService:MusicService) {
  }


  ngOnInit() {
    this.musicService.playMusic("assets/music/mainManu.wav")
  }

  ngOnDestroy() {
  }


}
