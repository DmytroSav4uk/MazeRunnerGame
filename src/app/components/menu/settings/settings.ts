import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {PublicFunctions} from '../../../services/publicFunctions/public-functions';
import {ISettings} from '../../../interfaces/settings';
import {MusicService} from '../../../services/music/music';
import {equivalentKeys} from '../../../configs/equivalents';


@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  form!: FormGroup;
  activeSection: 'audio' | 'controls' | 'difficulty' = 'audio';

  difficulties = ['easy', 'medium', 'hard'];
  controlNames = ['up', 'down', 'left', 'right', 'use', 'sprint', 'inventory'];



  constructor(public publicFunc: PublicFunctions, private fb: FormBuilder, private musicService:MusicService) {
  }

  ngOnInit(): void {
    const savedSettings: ISettings | null = this.publicFunc.getLocalStorage('settings');

    this.form = this.fb.group({
      difficulty: [savedSettings?.difficulty ?? 'medium'],
      volume: [savedSettings?.volume ?? 0.5],
      controls: this.createDefaultControls(savedSettings?.controls)
    });


    this.form.valueChanges.subscribe(value => {
      this.publicFunc.setLocalStorage('settings', value);
      this.musicService.updateVolume()
    });
  }

  setSection(section: 'audio' | 'controls' | 'difficulty') {
    this.activeSection = section;
  }

  private createDefaultControls(savedControls?: any) {
    const group: any = {};
    const defaults = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F', 'Shift',"I"];

    this.controlNames.forEach((name, i) => {
      group[name] = [savedControls?.[name] || defaults[i]];
    });

    return this.fb.group(group);
  }

  bindKey(controlName: string) {
    window.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        event.preventDefault();

        const pressedKey = event.key;
        const isLetter = pressedKey.length === 1;
        const normalizedKey = isLetter ? pressedKey.toUpperCase() : pressedKey;

        const matchedKey = Object.keys(equivalentKeys).find(k =>
          equivalentKeys[k].includes(pressedKey)
        );

        const finalKey = matchedKey || normalizedKey;
        const allKeys = equivalentKeys[finalKey] || [finalKey];
        const control = this.form.get(['controls', controlName]);
        if (control) {
          control.setValue(allKeys);
        }

        console.log(`✅ Призначено: ${controlName} = ${allKeys.join(', ')}`);
      },
      { once: true }
    );
  }



}
