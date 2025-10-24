import {Component, Inject} from '@angular/core';
import {MainChar} from '../../interfaces/mainChar';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {IItem} from '../../interfaces/Item';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-inventory-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogTitle
  ],
  templateUrl: './inventory-dialog.html',
  styleUrl: './inventory-dialog.css'
})
export class InventoryDialog {
  items = MainChar.inventory.items;

  constructor(
    public dialogRef: MatDialogRef<InventoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  useItem(item: IItem) {

    const index = MainChar.inventory.items.findIndex(slot => slot.item.name === item.name);
    if (index !== -1) {
      MainChar.inventory.useItem(index, MainChar);
    }
  }

  close() {
    this.dialogRef.close();
  }


  canBeUsed(item: IItem): boolean {
    const currentRoute = this.router.url.toLowerCase();

    if (currentRoute.includes('maze')) {
      return !item.usableInMaze;
    } else if (currentRoute.includes('battle')) {
      return !item.usableInBattle;
    }

    return true;
  }




}
