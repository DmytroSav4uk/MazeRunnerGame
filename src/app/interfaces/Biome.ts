export interface IBiome {
  name: string
  backgroundColor: string
  wallAssets: string[]
  groundAssets: string[]
  wallTexture?:string
}

export const forest: IBiome = {
  name: 'Emerald Woods',
  backgroundColor: '#228b22',
  wallAssets: ["assets/mazeLevel/Emerald woods/wall/tree.png", "assets/mazeLevel/Emerald woods/wall/birch.png", "assets/mazeLevel/Emerald woods/wall/appleTree.png"],
  groundAssets: ["assets/mazeLevel/Emerald woods/ground/bush1.png", "assets/mazeLevel/Emerald woods/ground/bush2.png", "assets/mazeLevel/Emerald woods/ground/littleTree.png", "assets/mazeLevel/Emerald woods/ground/mushroom.png", "assets/mazeLevel/Emerald woods/ground/mushrooms.png", "assets/mazeLevel/Emerald woods/ground/pen.png"]
}

export const dungeon: IBiome = {
  name: 'Spooky Dungeon',
  backgroundColor: 'black',
  wallAssets: [""],
  wallTexture:"assets/mazeLevel/Spooky dungeon/wall/dungeonWall.png",
  groundAssets: ["assets/mazeLevel/Spooky dungeon/ground/skulls.png"]
}

export const winterForest: IBiome = {
  name: 'Glassy Forest',
  backgroundColor: 'lightblue',
  wallAssets: [],
  groundAssets: []
}
