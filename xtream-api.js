
/**
 * Xtream API JavaScript Library
 * A single-file JavaScript implementation for interacting with Xtream compatible player APIs
 * Based on @iptv/xtream-api TypeScript library
 * 
 * http://beta.fishwrangler.com/_ai/x/xtream-api.js
 * 
 * License: MIT
 * 
 * Author: @joefaron
 * 
 * Return shape (all methods):
 *     Promise<object> - Raw API response data
 * 
 * Quick Start:
 *     const xtream = new XtreamAPI({
 *         url: 'http://example.com:8080',
 *         username: 'username',
 *         password: 'password'
 *     });
 *     
 *     // Test connection
 *     const profile = await xtream.getProfile();
 *     // -> {user_info: {...}, server_info: {...}}
 * 
 *     // Get all categories for each content type
 *     const liveCategories = await xtream.getChannelCategories();
 *     // -> [{category_id: 1, category_name: "News & Information", parent_id: 0}, ...]
 *     
 *     const vodCategories = await xtream.getMovieCategories();
 *     // -> [{category_id: 1, category_name: "Public Domain Classics", parent_id: 0}, ...]
 *     
 *     const seriesCategories = await xtream.getShowCategories();
 *     // -> [{category_id: 1, category_name: "Educational Content", parent_id: 0}, ...]
 * 
 *     // Get all streams for each content type (no category filtering)
 *     const allChannels = await xtream.getChannels();
 *     // -> [{stream_id: 123, name: "NASA TV", stream_icon: "...", epg_channel_id: "456", 
 *     //      category_id: 1, is_adult: false, tv_archive: true, ...}, ...]
 *     
 *     const allMovies = await xtream.getMovies();
 *     // -> [{stream_id: 456, name: "Metropolis (1927)", stream_icon: "...", rating: 8.3, 
 *     //      container_extension: "mp4", category_id: 1, ...}, ...]
 *     
 *     const allSeries = await xtream.getShows();
 *     // -> [{series_id: 789, name: "Cosmos: A Personal Voyage", cover: "...", plot: "...", 
 *     //      cast: "Carl Sagan", director: "Carl Sagan", genre: "Documentary, Science", release_date: "1980", ...}, ...]
 * 
 *     // Get detailed info for specific content
 *     const movieDetails = await xtream.getMovie({movieId: 456});
 *     // -> {info: {name: "Metropolis", year: "1927", director: "Fritz Lang", 
 *     //      cast: "Brigitte Helm, Alfred Abel", genre: "Sci-Fi, Drama", plot: "...", 
 *     //      cover_big: "...", backdrop_path: [...], rating: 8.3, duration: "02:33:00", 
 *     //      country: "Germany", release_date: "1927-01-10", ...}, 
 *     //   movie_data: {stream_id: 456, name: "Metropolis (1927)", ...}}
 *     
 *     const seriesDetails = await xtream.getShow({showId: 789});
 *     // -> {seasons: [{id: 1, name: "Season 1", air_date: "1980-09-28", 
 *     //      episode_count: 13, cover: "...", cover_big: "...", vote_average: 9.3, ...}, ...],
 *     //   info: {name: "Cosmos: A Personal Voyage (1980)", title: "Cosmos: A Personal Voyage", year: "1980", 
 *     //      plot: "...", cast: "Carl Sagan", director: "Carl Sagan", 
 *     //      genre: "Documentary, Science, Education", cover: "...", backdrop_path: [...], rating: 9.3, 
 *     //      release_date: "1980-09-28", episode_run_time: "60", ...},
 *     //   episodes: {"1": [{id: "123", episode_num: "1", title: "The Shores of the Cosmic Ocean", 
 *     //      plot: "...", release_date: "1980-09-28", duration: "01:00:00", 
 *     //      movie_image: "...", cover_big: "...", rating: 9.3, season: 1, ...}, ...]}}
 * 
 *     // Generate stream URLs
 *     const channelUrl = xtream.getChannelUrl(123);
 *     // -> "http://proxy.example.com:8080/live/username/password/123.m3u8"
 *     
 *     const movieUrl = xtream.getMovieUrl(456);
 *     // -> "http://proxy.example.com:8080/movie/username/password/456.mp4"
 *     
 *     const episodeUrl = xtream.getEpisodeUrl(789);
 *     // -> "http://proxy.example.com:8080/series/username/password/789.mkv"
 */

class XtreamAPI {
    constructor(config) {
        this.config = {
            url: config.url,
            username: config.username,
            password: config.password,
            preferredFormat: config.preferredFormat || 'm3u8',
            serializer: config.serializer || null,
            timeout: config.timeout || 30000
        };
        
        // Build base API URL with auth params
        const baseUrl = new URL('/player_api.php', this.config.url);
        baseUrl.searchParams.set('username', this.config.username);
        baseUrl.searchParams.set('password', this.config.password);
        this.baseApiUrl = baseUrl.toString();
    }

    // Core API request method
    // request(action, params) -> Promise<object>
    async request(action, params = {}) {
        const url = new URL(this.baseApiUrl);
        url.searchParams.set('action', action);
        
        // Add additional parameters
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, value);
            }
        });

        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            console.log(`ðŸŒ Making request to: ${url.toString()}`);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                cache: 'no-cache',
                signal: controller.signal,
                credentials: 'omit' // Don't send cookies for cross-origin requests
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`âœ… Request successful for action: ${action}`);
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${this.config.timeout}ms`);
            }
            
            // Provide more specific error messages for common issues
            if (error.message.includes('Failed to fetch')) {
                if (error.message.includes('CORS')) {
                    throw new Error(`CORS error: The server at ${this.config.url} doesn't allow cross-origin requests from this domain. This is a server-side configuration issue.`);
                } else {
                    throw new Error(`Network error: Unable to connect to ${this.config.url}. Please check if the server is running and accessible.`);
                }
            }
            
            throw new Error(`Xtream API request failed: ${error.message}`);
        }
    }

    // Apply serializer if configured
    // serialize(data, method) -> object
    serialize(data, method) {
        if (!this.config.serializer || !this.config.serializer.serializers) {
            return data;
        }

        const serializer = this.config.serializer.serializers[method];
        if (typeof serializer === 'function') {
            return serializer(data);
        }

        return data;
    }

    // User profile and server info
    // getProfile() -> Promise<object> {user_info: object, server_info: object}
    async getProfile() {
        const data = await this.request('get_profile');
        return this.serialize(data, 'profile');
    }

    // getServerInfo() -> Promise<object> {server_protocol: string, server_timezone: string, ...}
    async getServerInfo() {
        const data = await this.request('get_server_info');
        return this.serialize(data, 'serverInfo');
    }

    // Channel methods
    // getChannelCategories() -> Promise<array> [{category_id: number, category_name: string, ...}]
    async getChannelCategories() {
        const data = await this.request('get_live_categories');
        return this.serialize(data, 'channelCategories');
    }

    // getChannels(options) -> Promise<array> [{stream_id: number, name: string, stream_icon: string, ...}]
    // options: {categoryId?: number}
    async getChannels(options = {}) {
        const params = {};
        if (options.categoryId) params.category_id = options.categoryId;
        
        const data = await this.request('get_live_streams', params);
        return this.serialize(data, 'channels');
    }

    // Movie methods
    // getMovieCategories() -> Promise<array> [{category_id: number, category_name: string, ...}]
    async getMovieCategories() {
        const data = await this.request('get_vod_categories');
        return this.serialize(data, 'movieCategories');
    }

    // getMovies(options) -> Promise<array> [{stream_id: number, name: string, stream_icon: string, ...}]
    // options: {categoryId?: number}
    async getMovies(options = {}) {
        const params = {};
        if (options.categoryId) params.category_id = options.categoryId;
        
        const data = await this.request('get_vod_streams', params);
        return this.serialize(data, 'movies');
    }

    // getMovie(options) -> Promise<object> {stream_id: number, name: string, plot: string, ...}
    // options: {movieId: number}
    async getMovie(options) {
        const params = { vod_id: options.movieId };
        const data = await this.request('get_vod_info', params);
        return this.serialize(data, 'movie');
    }

    // Series/Shows methods
    // getShowCategories() -> Promise<array> [{category_id: number, category_name: string, ...}]
    async getShowCategories() {
        const data = await this.request('get_series_categories');
        return this.serialize(data, 'showCategories');
    }

    // getShows(options) -> Promise<array> [{series_id: number, name: string, cover: string, ...}]
    // options: {categoryId?: number}
    async getShows(options = {}) {
        const params = {};
        if (options.categoryId) params.category_id = options.categoryId;
        
        const data = await this.request('get_series', params);
        return this.serialize(data, 'shows');
    }

    // getShow(options) -> Promise<object> {series_id: number, name: string, plot: string, episodes: array}
    // options: {showId: number}
    async getShow(options) {
        const params = { series_id: options.showId };
        const data = await this.request('get_series_info', params);
        return this.serialize(data, 'show');
    }

    // EPG methods
    // getShortEPG(options) -> Promise<array> [{id: string, title: string, start_timestamp: string, ...}]
    // options: {channelId: number, limit?: number}
    async getShortEPG(options) {
        const params = { 
            stream_id: options.channelId
        };
        if (options.limit) params.limit = options.limit;
        
        const data = await this.request('get_short_epg', params);
        return this.serialize(data, 'shortEPG');
    }

    // getFullEPG(options) -> Promise<array> [{id: string, title: string, start_timestamp: string, ...}]
    // options: {channelId: number}
    async getFullEPG(options) {
        const params = { stream_id: options.channelId };
        const data = await this.request('get_simple_data_table', params);
        return this.serialize(data, 'fullEPG');
    }

    // Stream URL generation
    // generateStreamUrl(options) -> string
    // options: {type: string, streamId: number, extension: string, timeshift?: object}
    generateStreamUrl(options) {
        const { type, streamId, extension, timeshift } = options;
        const baseUrl = this.config.url.replace(/\/$/, ''); // Remove trailing slash
        
        let url;
        switch (type) {
            case 'channel':
                url = `${baseUrl}/live/${this.config.username}/${this.config.password}/${streamId}.${extension}`;
                break;
            case 'movie':
                url = `${baseUrl}/movie/${this.config.username}/${this.config.password}/${streamId}.${extension}`;
                break;
            case 'episode':
                url = `${baseUrl}/series/${this.config.username}/${this.config.password}/${streamId}.${extension}`;
                break;
            default:
                throw new Error(`Unsupported stream type: ${type}`);
        }

        // Add timeshift parameters if provided
        if (timeshift && timeshift.duration && timeshift.start) {
            const urlObj = new URL(url);
            urlObj.searchParams.set('utc', Math.floor(timeshift.start.getTime() / 1000));
            urlObj.searchParams.set('duration', timeshift.duration);
            url = urlObj.toString();
        }

        return url;
    }

    // Convenience methods for common stream URLs
    // getChannelUrl(streamId, extension) -> string
    // streamId: number, extension?: string
    getChannelUrl(streamId, extension = null) {
        return this.generateStreamUrl({
            type: 'channel',
            streamId,
            extension: extension || this.config.preferredFormat
        });
    }

    // getMovieUrl(streamId, extension) -> string
    // streamId: number, extension?: string
    getMovieUrl(streamId, extension = 'mp4') {
        return this.generateStreamUrl({
            type: 'movie',
            streamId,
            extension
        });
    }

    // getEpisodeUrl(streamId, extension) -> string
    // streamId: number, extension?: string
    getEpisodeUrl(streamId, extension = 'mp4') {
        return this.generateStreamUrl({
            type: 'episode',
            streamId,
            extension
        });
    }
}

// Serializer implementations
// CamelCaseSerializer -> object {type: string, serializers: object}
const CamelCaseSerializer = {
    type: 'CamelCase',
    serializers: {
        channelCategories: (data) => data.map(item => ({
            categoryId: item.category_id,
            categoryName: item.category_name,
            parentId: item.parent_id || 0
        })),
        movieCategories: (data) => data.map(item => ({
            categoryId: item.category_id,
            categoryName: item.category_name,
            parentId: item.parent_id || 0
        })),
        showCategories: (data) => data.map(item => ({
            categoryId: item.category_id,
            categoryName: item.category_name,
            parentId: item.parent_id || 0
        })),
        channels: (data) => data.map(item => ({
            streamId: item.stream_id,
            num: item.num,
            name: item.name,
            streamType: item.stream_type,
            streamIcon: item.stream_icon,
            epgChannelId: item.epg_channel_id,
            added: item.added,
            isAdult: item.is_adult,
            categoryId: item.category_id,
            categoryIds: item.category_ids || [],
            customSid: item.custom_sid,
            tvArchive: item.tv_archive,
            directSource: item.direct_source,
            tvArchiveDuration: item.tv_archive_duration
        })),
        movies: (data) => data.map(item => ({
            streamId: item.stream_id,
            name: item.name,
            streamIcon: item.stream_icon,
            rating: item.rating,
            rating5based: item.rating_5based,
            added: item.added,
            categoryId: item.category_id,
            containerExtension: item.container_extension,
            customSid: item.custom_sid,
            directSource: item.direct_source
        }))
    }
};

// StandardizedSerializer -> object {type: string, serializers: object}
const StandardizedSerializer = {
    type: 'Standardized',
    serializers: {
        channelCategories: (data) => data.map(item => ({
            id: String(item.category_id),
            name: item.category_name,
            parentId: item.parent_id ? String(item.parent_id) : null
        })),
        movieCategories: (data) => data.map(item => ({
            id: String(item.category_id),
            name: item.category_name,
            parentId: item.parent_id ? String(item.parent_id) : null
        })),
        showCategories: (data) => data.map(item => ({
            id: String(item.category_id),
            name: item.category_name,
            parentId: item.parent_id ? String(item.parent_id) : null
        })),
        channels: (data) => data.map(item => ({
            id: String(item.stream_id),
            number: item.num,
            name: item.name,
            icon: item.stream_icon,
            epgId: item.epg_channel_id,
            categoryId: String(item.category_id),
            isAdult: Boolean(item.is_adult),
            hasArchive: Boolean(item.tv_archive)
        })),
        movies: (data) => data.map(item => ({
            id: String(item.stream_id),
            name: item.name,
            icon: item.stream_icon,
            rating: parseFloat(item.rating) || 0,
            categoryId: String(item.category_id),
            extension: item.container_extension
        }))
    }
};

// JSONAPISerializer -> object {type: string, serializers: object}
const JSONAPISerializer = {
    type: 'JSON:API',
    serializers: {
        channelCategories: (data) => ({
            data: data.map(item => ({
                type: 'channel-category',
                id: String(item.category_id),
                attributes: {
                    name: item.category_name
                },
                ...(item.parent_id && {
                    relationships: {
                        parent: {
                            data: {
                                type: 'channel-category',
                                id: String(item.parent_id)
                            }
                        }
                    }
                })
            }))
        }),
        channels: (data) => ({
            data: data.map(item => ({
                type: 'channel',
                id: String(item.stream_id),
                attributes: {
                    number: item.num,
                    name: item.name,
                    icon: item.stream_icon,
                    epgId: item.epg_channel_id,
                    isAdult: Boolean(item.is_adult),
                    hasArchive: Boolean(item.tv_archive)
                },
                relationships: {
                    category: {
                        data: {
                            type: 'channel-category',
                            id: String(item.category_id)
                        }
                    }
                }
            }))
        })
    }
};

// Helper function for creating custom serializers
// defineSerializers(name, serializers) -> object {type: string, serializers: object}
// name: string, serializers: object
function defineSerializers(name, serializers) {
    return {
        type: name,
        serializers
    };
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = {
        XtreamAPI,
        CamelCaseSerializer,
        StandardizedSerializer,
        JSONAPISerializer,
        defineSerializers
    };
} else if (typeof define === 'function' && define.amd) {
    // AMD
    define(function() {
        return {
            XtreamAPI,
            CamelCaseSerializer,
            StandardizedSerializer,
            JSONAPISerializer,
            defineSerializers
        };
    });
} else {
    // Browser global
    window.XtreamAPI = XtreamAPI;
    window.XtreamSerializers = {
        CamelCase: CamelCaseSerializer,
        Standardized: StandardizedSerializer,
        JSONAPI: JSONAPISerializer
    };
    window.defineSerializers = defineSerializers;
}
