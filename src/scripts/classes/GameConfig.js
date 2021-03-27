//sounds
export const VOLUME_MAIN_THEME = 0.2;
export const VOLUME_ROCK_FALL = 0.4;
export const VOLUME_FOOD = 0.4;
export const VOLUME_MINE = 0.4;
export const VOLUME_GAME_OVER = 0.6;
export const VOLUME_DIG = 0.4;
export const VOLUME_CHEST = 0.4;
export const VOLUME_WIND = 0.3;

//player
export const FOOD = 10; //грок стартует с этим
export const TORCH = 18;
export const START_COL = 2;
export const START_ROW = 3;
export const MIN_TORCH_COUNT_TO_DIE = 5;

export const CHEST_MIN_FOOD = 3;
export const CHEST_MAX_FOOD = 20;
export const CHEST_FOOD_PERCENT = 0.5;
export const CHEST_MIN_GOLD = 1;
export const CHEST_MAX_GOLD = 10;
export const CHEST_GOLD_PERCENT0 = 0.3;
export const CHEST_MIN_SILVER = 2;
export const CHEST_MAX_SILVER = 10;
export const CHEST_SILVER_PERCENT = 0.3;
export const CHEST_MIN_TORCH = 5;
export const CHEST_MAX_TORCH = 20;
export const CHEST_TORCH_PERCENT = 0.5;

//hud
export const MAX_TORCH = 18;//если у игрока >=18 то тень не будет увеличиваться. и будет DEFAULT_MAX_SCALE
export const DEFAULT_MIN_SCALE = 1; //инимальный размер окна тени
export const DEFAULT_MAX_SCALE = 4;

//draw3p
export const GRIB_DROP_PERCENT = 0.1;
export const GRIB_ID = 4;
export const CHEST_DROP_PERCENT = 0.1;
export const CHEST_ID = 5;

//animation
export const START_MENU_UP_SPEED = 600;
export const GAME_UP_SPEED = 600;
export const FRAME_RATE_BOOM = 8;
export const DROP_BLOCK_SPEED = 100;
export const DROP_BLOCK_SCALE_SIZE = 3;

export default class GameConfig {
}