export interface IBiome {
  name: string
  backgroundColor: string
  wallAssets: string[]
  groundAssets: string[]
  wallTexture?: string
  skyEffect?: string
  music: string
}

export const forest: IBiome = {
  name: 'Emerald Woods',
  backgroundColor: '#228b22',
  wallAssets: ["assets/mazeLevel/Emerald woods/wall/tree.png", "assets/mazeLevel/Emerald woods/wall/birch.png", "assets/mazeLevel/Emerald woods/wall/appleTree.png"],
  groundAssets: ["assets/mazeLevel/Emerald woods/ground/bush1.png", "assets/mazeLevel/Emerald woods/ground/bush2.png", "assets/mazeLevel/Emerald woods/ground/littleTree.png", "assets/mazeLevel/Emerald woods/ground/mushroom.png", "assets/mazeLevel/Emerald woods/ground/mushrooms.png", "assets/mazeLevel/Emerald woods/ground/pen.png"],
  music: 'assets/music/emeraldForestMusic.wav'
}

export const dungeon: IBiome = {
  name: 'Spooky Dungeon',
  backgroundColor: '#191919',
  wallAssets: [],
  wallTexture: "assets/mazeLevel/Spooky dungeon/wall/dungeonWall.png",
  groundAssets: ["assets/mazeLevel/Spooky dungeon/ground/skulls.png"],
  music: 'assets/music/spookyDungeonMusic.wav'
}

export const winterForest: IBiome = {
  name: 'Glassy Forest',
  backgroundColor: '#f3faff',
  wallAssets: ["assets/mazeLevel/Glassy forest/wall/pine.png", "assets/mazeLevel/Glassy forest/wall/pine.png"],
  groundAssets: ["assets/mazeLevel/Glassy forest/ground/snow1.png", "assets/mazeLevel/Glassy forest/ground/snow2.png", "assets/mazeLevel/Glassy forest/ground/snow3.png", "assets/mazeLevel/Glassy forest/ground/snowman1.png", "assets/mazeLevel/Glassy forest/ground/snowman2.png", "assets/mazeLevel/Glassy forest/ground/candy.png"],
  skyEffect: "assets/mazeLevel/Glassy forest/snow.gif",
  music: 'assets/music/glassyForestMusic.wav'
}
