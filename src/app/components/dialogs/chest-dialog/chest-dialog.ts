import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

import {MatButton} from '@angular/material/button';
import {IItem} from '../../../interfaces/Item';

@Component({
  selector: 'app-chest-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatButton
  ],
  templateUrl: './chest-dialog.html',
  styleUrl: './chest-dialog.css'
})
export class ChestDialog {
  constructor(
    public dialogRef: MatDialogRef<ChestDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { item: IItem }
  ) {
  }

  close() {
    this.dialogRef.close();
  }
}
