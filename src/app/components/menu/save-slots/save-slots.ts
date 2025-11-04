import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Router } from '@angular/router';
import {TimestampPipePipe} from '../../../pipes/timestamp-pipe-pipe';
import {SavesService} from '../../../services/saves/saves-service';
import {IBiome} from '../../../interfaces/Biome';
import {IChest} from '../../../interfaces/Chest';
import {ISave} from '../../../interfaces/save';
import {MainChar} from '../../../interfaces/mainChar';


@Component({
  selector: 'app-save-slots',
  imports: [
    TimestampPipePipe
  ],
  templateUrl: './save-slots.html',
  styleUrl: './save-slots.css'
})
export class SaveSlots implements OnInit {

  constructor(private saveService: SavesService, private router: Router) {}

  @Input() currentLevel!: number;
  @Input() maze!: any;
  @Input() playerX!: number;
  @Input() playerY!: number;
  @Input() goalRow!: number;
  @Input() goalCol!: number;
  @Input() showSaveMenu: boolean = false;
  @Input() currentBiome!: IBiome;
  @Input() nextLevelBiome!: IBiome;
  @Input() chests!: IChest[];


  @Output() closeSaveMenu: EventEmitter<void> = new EventEmitter();

  saves: any;
  currentRoute: any;

  ngOnInit() {
    this.getAllSaves();
    this.currentRoute = this.router.url.replace('/', '');
  }

  getAllSaves() {
    this.saveService.getAll().subscribe((res) => {
      this.saves = res;
    });
  }

  goBack() {
    if (this.currentRoute === "menu/saves") {
      this.router.navigateByUrl('menu');
    } else if (this.currentRoute.includes("maze")) {
      this.closeSaveMenu.emit();
    }
  }

  saveToSlot(slot: string) {
    const saveObj: ISave = {
      slot: slot,
      level: this.currentLevel,
      maze: this.maze,
      playerX: this.playerX,
      playerY: this.playerY,
      goalRow: this.goalRow,
      goalCol: this.goalCol,
      currentBiome: this.currentBiome,
      nextLevelBiome: this.nextLevelBiome,


      chests: this.chests ?? [],
      playerState: {
        health: MainChar.health,
        maxHealth: MainChar.maxHealth,
        armor:MainChar.armor,
        damage:MainChar.damage,
        inventory: MainChar.inventory.items.map(it => ({
          item: it.item,
          quantity: it.quantity ?? 1
        }))
      }
    };

    this.saveService.saveGame(saveObj).subscribe(() => {
      this.getAllSaves();
    });
  }

  loadSlot(slot: string) {
    this.router.navigateByUrl('maze?slot=' + slot);
  }
}
