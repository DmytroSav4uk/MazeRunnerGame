import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credits.html',
  styleUrl: './credits.css'
})
export class Credits {

  @Input() themeColor: string = '#6abc3a';
  @Input() closeButtonColor: string = '#bc3a3a';
  @Input() containerWidth: string = '80%';
  @Input() verticalAlign: 'center' | 'flex-start' | 'flex-end' = 'center';

  constructor(private router: Router) {}

  redirectTo(whereTo: string) {
    this.router.navigateByUrl(whereTo);
  }
}
