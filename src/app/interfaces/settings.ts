export interface IControls {
  up: string[] | string;
  down: string[] | string;
  left: string[] | string;
  right: string[] | string;
  use: string[] | string;
  sprint: string[] | string;
}

export interface ISettings {
  difficulty?: string;
  volume?: number;
  controls?: IControls;
}
