export interface IBiome  {
  name:string
  backgroundColor:string
  wallAssets:[]
  groundAssets:[]
}

export const forest:IBiome = {
  name:'Emerald Woods',
  backgroundColor:'green',
  wallAssets:[],
  groundAssets:[]
}

export const dungeon:IBiome = {
  name:'Spooky Dungeon',
  backgroundColor:'black',
  wallAssets:[],
  groundAssets:[]
}

export const winterForest:IBiome = {
  name:'Glassy Forest',
  backgroundColor:'lightblue',
  wallAssets:[],
  groundAssets:[]
}
