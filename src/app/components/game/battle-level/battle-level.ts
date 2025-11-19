import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SavesService} from '../../../services/saves/saves-service';
import {ISave} from '../../../interfaces/save';
import {SkeletonEnemy, MushroomEnemy, IEnemy} from '../../../interfaces/Enemy';
import {IMainChar, MainChar} from '../../../interfaces/mainChar';

@Component({
  selector: 'app-battle-level',
  imports: [],
  templateUrl: './battle-level.html',
  styleUrl: './battle-level.css'
})
export class BattleLevel implements OnInit, AfterViewInit {

  constructor(private savesService: SavesService) {
  }

  beforeBattleSave: any
  battleBiome: any
  backgroundImage: any

  enemy!: IEnemy;
  mainChar: IMainChar = MainChar

  ngOnInit() {
    this.loadInitialData()
    console.log(this.mainChar)
  }

  ngAfterViewInit() {

  }

  loadInitialData() {
    this.savesService.loadGame('beforeBattle').subscribe((res: any) => {
      this.beforeBattleSave = res.data
      const data: ISave = res.data

      this.battleBiome = data.currentBiome.name

      this.setBackgroundImage()
      this.setEnemy()
    })
  }

  setBackgroundImage() {
    switch (this.battleBiome) {
      case 'Emerald Woods' :
        this.backgroundImage = 'assets/battle/forestBattle.jpg';
        break;
      case 'Spooky Dungeon':
        this.backgroundImage = 'assets/battle/dungeonBattle.png';
        break
    }
    console.log(this.backgroundImage)
  }

  setEnemy() {
    switch (this.battleBiome) {
      case 'Emerald Woods' :
        this.enemy = MushroomEnemy;
        break;
      case 'Spooky Dungeon':
        this.enemy = SkeletonEnemy;
        break
    }
  }


}
