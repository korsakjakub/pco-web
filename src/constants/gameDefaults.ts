export const GAME_DEFAULTS = {
  STARTING_CHIPS: 1000,
  SMALL_BLIND: 25,
  BIG_BLIND: 50,
  ANTE: 0,
  MIN_PLAYER_NAME_LENGTH: 2,
} as const;

export const UI_CONSTANTS = {
  QUERY_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  RETRY_ATTEMPTS: 2,
  WEBSOCKET_RETRY_ATTEMPTS: 3,
  WEBSOCKET_RETRY_DELAY: 1000, // 1 second
} as const;

export const STORAGE_KEYS = {
  CONTEXT: 'ctx',
  HOST_URL: 'hostUrl',
  FRONT_URL: 'frontUrl',
} as const;

export const ROUTES = {
  HOME: '/',
  JOIN: '/join/:queueId',
  GAME: '/game/:roomId',
  QUEUE: '/queue/:queueId',
  NOT_FOUND: '*',
} as const;