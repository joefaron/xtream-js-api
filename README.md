# XTREAM API

```
 ██╗  ██╗████████╗██████╗ ███████╗ █████╗ ███╗   ███╗       █████╗ ██████╗ ██╗       ██╗███████╗
 ╚██╗██╔╝╚══██╔══╝██╔══██╗██╔════╝██╔══██╗████╗ ████║      ██╔══██╗██╔══██╗██║       ██║██╔════╝
  ╚███╔╝    ██║   ██████╔╝█████╗  ███████║██╔████╔██║█████╗███████║██████╔╝██║       ██║███████╗
  ██╔██╗    ██║   ██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║╚════╝██╔══██║██╔═══╝ ██║  ██   ██║╚════██║
 ██╔╝ ██╗   ██║   ██║  ██║███████╗██║  ██║██║ ╚═╝ ██║      ██║  ██║██║     ██║  ╚█████╔╝███████║
 ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝      ╚═╝  ╚═╝╚═╝     ╚═╝   ╚════╝ ╚══════╝
                                                                                                   
    ╔════════════════════════════════════════════════════════════════════════════════════════╗
    ║         PRIVACY FIRST • OPEN SOURCE • ZERO DEPENDENCIES • NO BS, JUST JS               ║
    ╚════════════════════════════════════════════════════════════════════════════════════════╝
```

> **"The Matrix has you... but your xtream API doesn't have to."**

Single-file JavaScript library for Xtream compatible APIs. Clean, simple, readable code following Ruby on Rails philosophy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Privacy First](https://img.shields.io/badge/Privacy-First-blue.svg)](#privacy) [![Open Source](https://img.shields.io/badge/Open%20Source-FTW-red.svg)](https://opensource.org/)

## Features

* **Privacy First** - No tracking, local processing only
* **Zero Dependencies** - Single file, works everywhere
* **Universal** - Browser, Node.js, Deno, Bun
* **Smart Serializers** - Raw, CamelCase, Standardized, JSON:API
* **Battle Tested** - Comprehensive test suite
* **Timeout Support** - Configurable request timeouts
* **CORS Handling** - Built-in cross-origin request support

## Quick Start

```javascript
// Browser
<script src="xtream-api.js"></script>

// Node.js / ES Modules
const { XtreamAPI } = require('./xtream-api.js');

// Initialize
const xtream = new XtreamAPI({
  url: 'http://example.com:8080',
  username: 'username',
  password: 'password',
  preferredFormat: 'm3u8',  // Optional: default stream format
  timeout: 30000            // Optional: request timeout in ms
});

// Test connection
const profile = await xtream.getProfile();
// -> {user_info: {...}, server_info: {...}}

// Get all categories for each content type
const liveCategories = await xtream.getChannelCategories();
// -> [{category_id: 1, category_name: "News & Information", parent_id: 0}, ...]

const vodCategories = await xtream.getMovieCategories();
// -> [{category_id: 1, category_name: "Public Domain Classics", parent_id: 0}, ...]

const seriesCategories = await xtream.getShowCategories();
// -> [{category_id: 1, category_name: "Educational Content", parent_id: 0}, ...]

// Get all streams for each content type (no category filtering)
const allChannels = await xtream.getChannels();
// -> [{stream_id: 123, name: "NASA TV", stream_icon: "...", epg_channel_id: "456", 
//      category_id: 1, is_adult: false, tv_archive: true, ...}, ...]

const allMovies = await xtream.getMovies();
// -> [{stream_id: 456, name: "Metropolis (1927)", stream_icon: "...", rating: 8.3, 
//      container_extension: "mp4", category_id: 1, ...}, ...]

const allSeries = await xtream.getShows();
// -> [{series_id: 789, name: "Cosmos: A Personal Voyage", cover: "...", plot: "...", 
//      cast: "Carl Sagan", director: "Carl Sagan", genre: "Documentary, Science", release_date: "1980", ...}, ...]

// Get detailed info for specific content
const movieDetails = await xtream.getMovie({movieId: 456});
// -> {info: {name: "Metropolis", year: "1927", director: "Fritz Lang", 
//      cast: "Brigitte Helm, Alfred Abel", genre: "Sci-Fi, Drama", plot: "...", 
//      cover_big: "...", backdrop_path: [...], rating: 8.3, duration: "02:33:00", 
//      country: "Germany", release_date: "1927-01-10", ...}, 
//   movie_data: {stream_id: 456, name: "Metropolis (1927)", ...}}

const seriesDetails = await xtream.getShow({showId: 789});
// -> {seasons: [{id: 1, name: "Season 1", air_date: "1980-09-28", 
//      episode_count: 13, cover: "...", cover_big: "...", vote_average: 9.3, ...}, ...],
//   info: {name: "Cosmos: A Personal Voyage (1980)", title: "Cosmos: A Personal Voyage", year: "1980", 
//      plot: "...", cast: "Carl Sagan", director: "Carl Sagan", 
//      genre: "Documentary, Science, Education", cover: "...", backdrop_path: [...], rating: 9.3, 
//      release_date: "1980-09-28", episode_run_time: "60", ...},
//   episodes: {"1": [{id: "123", episode_num: "1", title: "The Shores of the Cosmic Ocean", 
//      plot: "...", release_date: "1980-09-28", duration: "01:00:00", 
//      movie_image: "...", cover_big: "...", rating: 9.3, season: 1, ...}, ...]}} 

// Generate stream URLs
const channelUrl = xtream.getChannelUrl(123);
// -> "http://example.com:8080/live/username/password/123.m3u8"

const movieUrl = xtream.getMovieUrl(456);
// -> "http://example.com:8080/movie/username/password/456.mp4"

const episodeUrl = xtream.getEpisodeUrl(789);
// -> "http://example.com:8080/series/username/password/789.mp4"
// -> "https://archive.org/details/CosmosAPersonalVoyage/1980+Cosmos+(A+Personal+Voyage)+-+Ep+01+The+Shores+of+the+Cosmic+Ocean.mp4"
```

## Configuration Options

```javascript
const xtream = new XtreamAPI({
  url: 'http://example.com:8080',        // Required: Server URL
  username: 'username',                   // Required: Username
  password: 'password',                   // Required: Password
  preferredFormat: 'm3u8',               // Optional: Default stream format (default: 'm3u8')
  serializer: null,                       // Optional: Data serializer (default: null)
  timeout: 30000                          // Optional: Request timeout in ms (default: 30000)
});
```

## API Methods

### User & Server Methods

#### `getProfile() -> Promise<object>`
**Returns:** User account information and subscription details
```javascript
const profile = await xtream.getProfile();
```
**URL:** `GET /player_api.php?action=get_profile`
**Response:**
```json
{
  "user_info": {
    "username": "string",
    "auth": 1,
    "status": "string",
    "exp_date": "string",
    "max_connections": "string"
  },
  "server_info": {
    "url": "string",
    "port": "string", 
    "timestamp_now": 1672531200
  }
}
```

#### `getServerInfo() -> Promise<object>`
**Returns:** Server configuration and capabilities
```javascript
const serverInfo = await xtream.getServerInfo();
```
**URL:** `GET /player_api.php?action=get_server_info`
**Response:**
```json
{
  "url": "string",
  "port": "string",
  "timestamp_now": 1672531200,
  "time_now": "string"
}
```

### Live TV Methods

#### `getChannelCategories() -> Promise<array>`
**Returns:** Array of live TV categories
```javascript
const categories = await xtream.getChannelCategories();
```
**URL:** `GET /player_api.php?action=get_live_categories`
**Response:**
```json
[
  {
    "category_id": "string",
    "category_name": "string", 
    "parent_id": 0
  }
]
```

#### `getChannels(options?) -> Promise<array>`
**Args:** `{ categoryId?: number }`
**Returns:** Array of live TV channels
```javascript
const channels = await xtream.getChannels({ categoryId: 2 });
```
**URL:** `GET /player_api.php?action=get_live_streams&category_id=2`
**Response:**
```json
[
  {
    "stream_id": 123,
    "num": 1,
    "name": "string",
    "stream_type": "live",
    "stream_icon": "string",
    "epg_channel_id": "string",
    "category_id": "string",
    "tv_archive": 1,
    "is_adult": "string"
  }
]
```

### Movies (VOD) Methods

#### `getMovieCategories() -> Promise<array>`
**Returns:** Array of movie categories
```javascript
const movieCategories = await xtream.getMovieCategories();
```
**URL:** `GET /player_api.php?action=get_vod_categories`
**Response:**
```json
[
  {
    "category_id": "string",
    "category_name": "string",
    "parent_id": 0
  }
]
```

#### `getMovies(options?) -> Promise<array>`
**Args:** `{ categoryId?: number }`
**Returns:** Array of movies
```javascript
const movies = await xtream.getMovies({ categoryId: 10 });
```
**URL:** `GET /player_api.php?action=get_vod_streams&category_id=10`
**Response:**
```json
[
  {
    "stream_id": 456,
    "name": "string",
    "stream_icon": "string",
    "rating": "string",
    "rating_5based": 4.35,
    "category_id": "string",
    "container_extension": "string"
  }
]
```

#### `getMovie({ movieId }) -> Promise<object>`
**Args:** `{ movieId: number }`
**Returns:** Detailed movie information
```javascript
const movie = await xtream.getMovie({ movieId: 456 });
```
**URL:** `GET /player_api.php?action=get_vod_info&vod_id=456`
**Response:**
```json
{
  "info": {
    "name": "string",
    "description": "string",
    "year": "string",
    "duration": "string",
    "rating": "string",
    "genre": "string",
    "cast": "string"
  },
  "movie_data": {
    "stream_id": 456,
    "container_extension": "string"
  }
}
```

### TV Series Methods

#### `getShowCategories() -> Promise<array>`
**Returns:** Array of TV series categories
```javascript
const showCategories = await xtream.getShowCategories();
```
**URL:** `GET /player_api.php?action=get_series_categories`
**Response:**
```json
[
  {
    "category_id": "string",
    "category_name": "string",
    "parent_id": 0
  }
]
```

#### `getShows(options?) -> Promise<array>`
**Args:** `{ categoryId?: number }`
**Returns:** Array of TV series
```javascript
const shows = await xtream.getShows({ categoryId: 20 });
```
**URL:** `GET /player_api.php?action=get_series&category_id=20`
**Response:**
```json
[
  {
    "series_id": 789,
    "name": "string",
    "cover": "string",
    "plot": "string",
    "cast": "string",
    "rating": "string",
    "category_id": "string"
  }
]
```

#### `getShow({ showId }) -> Promise<object>`
**Args:** `{ showId: number }`
**Returns:** Detailed series information with seasons and episodes
```javascript
const show = await xtream.getShow({ showId: 789 });
```
**URL:** `GET /player_api.php?action=get_series_info&series_id=789`
**Response:**
```json
{
  "info": {
    "name": "string",
    "plot": "string",
    "cast": "string",
    "rating": "string"
  },
  "seasons": [
    {
      "season_number": 1,
      "name": "string",
      "episode_count": "string"
    }
  ],
  "episodes": {
    "1": [
      {
        "id": "string",
        "episode_num": 1,
        "title": "string",
        "container_extension": "string"
      }
    ]
  }
}
```

### EPG Methods

#### `getShortEPG({ channelId, limit? }) -> Promise<array>`
**Args:** `{ channelId: number, limit?: number }`
**Returns:** EPG data for specific channel
```javascript
const epg = await xtream.getShortEPG({ channelId: 123, limit: 5 });
```
**URL:** `GET /player_api.php?action=get_short_epg&stream_id=123&limit=5`
**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "start": "string",
    "end": "string",
    "description": "string",
    "start_timestamp": "string",
    "stop_timestamp": "string"
  }
]
```

#### `getFullEPG({ channelId }) -> Promise<array>`
**Args:** `{ channelId: number }`
**Returns:** Complete EPG data for specific channel
```javascript
const epg = await xtream.getFullEPG({ channelId: 123 });
```
**URL:** `GET /player_api.php?action=get_simple_data_table&stream_id=123`

### Stream URL Methods

#### `getChannelUrl(streamId, extension?) -> string`
**Args:** `streamId: number, extension?: string`
**Returns:** Live TV channel stream URL
```javascript
const url = xtream.getChannelUrl(123, 'ts');
// Returns: "http://example.com:8080/live/username/password/123.ts"
```

#### `getMovieUrl(streamId, extension?) -> string`
**Args:** `streamId: number, extension?: string`
**Returns:** Movie stream URL
```javascript
const url = xtream.getMovieUrl(456, 'mp4');
// Returns: "http://example.com:8080/movie/username/password/456.mp4"
```

#### `getEpisodeUrl(episodeId, extension?) -> string`
**Args:** `episodeId: number, extension?: string`
**Returns:** TV series episode stream URL
```javascript
const url = xtream.getEpisodeUrl(12345);
// Returns: "http://example.com:8080/series/username/password/12345.mp4"
```

#### `generateStreamUrl(options) -> string`
**Args:** `StreamOptions`
**Returns:** Custom stream URL with advanced options
```javascript
const url = xtream.generateStreamUrl({
  type: 'channel',
  streamId: 123,
  extension: 'm3u8',
  timeshift: {
    start: new Date('2023-01-01T10:00:00Z'),
    duration: 3600
  }
});
```

**StreamOptions:**
- `type: 'channel' | 'movie' | 'episode'`
- `streamId: number`
- `extension: string`
- `timeshift?: { start: Date, duration: number }`

## Serializers

```javascript
// Raw (default)
const xtream = new XtreamAPI(config);

// CamelCase
const xtream = new XtreamAPI({...config, serializer: XtreamSerializers.CamelCase});

// Standardized
const xtream = new XtreamAPI({...config, serializer: XtreamSerializers.Standardized});

// JSON:API
const xtream = new XtreamAPI({...config, serializer: XtreamSerializers.JSONAPI});

// Custom
const custom = defineSerializers('MyCustom', {
  channels: (data) => data.map(ch => ({id: ch.stream_id, name: ch.name}))
});
```

## Error Handling

The library provides detailed error messages for common issues:

```javascript
try {
  const channels = await xtream.getChannels();
} catch (error) {
  if (error.message.includes('CORS error')) {
    // Server doesn't allow cross-origin requests
  } else if (error.message.includes('Network error')) {
    // Unable to connect to server
  } else if (error.message.includes('Request timeout')) {
    // Request timed out
  }
}
```

## Testing

Open `xtream-api-test.html` in your browser for comprehensive endpoint testing.

## Privacy

* **No tracking** - Zero analytics or telemetry
* **Local processing** - All operations client-side
* **Direct connections** - Only your Xtream server
* **Transparent code** - Single file, fully auditable
* **No dependencies** - Eliminates supply chain risks

## Philosophy (inspired by rubyonrails.org)

* **Convention over Configuration** - Sensible defaults
* **Developer Happiness** - Simple API, great DX
* **No BS** - Every line serves a purpose
* **Make it work, make it right, make it fast**

## License

MIT License - Free and open source.

## Credits

**Original**: [ektotv/xtream-api](https://github.com/ektotv/xtream-api) - TypeScript library foundation  
**Port**: [@joefaron](https://github.com/joefaron)
