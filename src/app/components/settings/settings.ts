import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {PublicFunctions} from '../../services/publicFunctions/public-functions';
import {equivalentKeys} from '../../configs/equivalents';
import {ISettings} from '../../interfaces/settings';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  form!: FormGroup;

  difficulties = ['easy', 'medium', 'hard'];
  controlNames = ['up', 'down', 'left', 'right', 'use', 'sprint'];

  constructor(public publicFunc: PublicFunctions, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    const savedSettings: ISettings | null = this.publicFunc.getLocalStorage('settings');

    this.form = this.fb.group({
      difficulty: [savedSettings?.difficulty || 'medium'],
      volume: [savedSettings?.volume || 50],
      controls: this.createDefaultControls(savedSettings?.controls)
    });

    this.form.valueChanges.subscribe(value => {
      this.publicFunc.setLocalStorage('settings', value);
    });
  }

  private createDefaultControls(savedControls?: any) {
    const group: any = {};
    const defaults = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F', 'Shift'];

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

        const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;

        const allKeys = equivalentKeys[key] || [key];

        const control = this.form.get(['controls', controlName]);
        if (control) {
          control.setValue(allKeys);
        }
      },
      { once: true }
    );
  }

}
