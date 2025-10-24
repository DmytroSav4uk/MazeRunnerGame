import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {IItem} from '../../interfaces/Item';
import {MatButton} from '@angular/material/button';

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
