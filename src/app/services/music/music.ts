import {Injectable} from '@angular/core';
import {PublicFunctions} from '../publicFunctions/public-functions';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private currentAudio?: HTMLAudioElement;
  volume: any;

  constructor(private publicFn: PublicFunctions) {
    this.getVolume();
  }

  playMusic(music: string) {

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    this.currentAudio = new Audio(music);
    this.currentAudio.loop = true;
    this.currentAudio.volume = this.volume;

    console.log(this.volume)

    this.currentAudio
      .play()
      .catch(err => console.warn('🎵 Error playing music:', err));
  }

  stopMusic() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = undefined;
    }
  }

  getVolume() {
    const settings = this.publicFn.getLocalStorage('settings');
    const vol = settings?.volume;

    this.volume = typeof vol === 'number'? vol: parseFloat(vol ?? '0.5');
  }


  updateVolume() {
    this.getVolume();
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

}
