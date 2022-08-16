/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export default class RedditService {
  constructor(url, after, useNew = false) {
    this.baseUrl_ = url;
    this.after_ = after || '';
    this.useNew_ = useNew || false;
    this.nextAfter_ = null;
  }

  nextAfter() {
    return this.nextAfter_;
  }

  getUrl_() {
    let url = this.baseUrl_;
    if (this.useNew_) {
      url += '/new';
    }
    return `${url}.json?after=${this.after_}`;
  }

  async fetch() {
    const req = await fetch(this.getUrl_());
    const resp = await req.json();
    this.nextAfter_ = resp.data.after;
    return resp.data.children
      .map(({ data }, i) => {
        const o = {
          url: data.url,
          author: data.author,
          title: data.title,
          permalink: 'https://reddit.com' + data.permalink,
          id: data.id,
          index: i + 1
        };
        if (data.is_video && (data.media.reddit_video || data.secure_media.reddit_video)) {
          Object.assign(o, this.extractVideo_(data));
        } else if (data.url.startsWith('https://v.redd.it/')) {
          Object.assign(o, this.guessVideo_(data));
        } else if (data.url.startsWith('https://i.redd.it/') || (data.url.startsWith('https://i.imgur.com/'))) {
          Object.assign(o, this.extractImage_(data));
        } else if (data.url.startsWith('https://gfycat.com/')) {
          Object.assign(o, this.extractGfycat_(data));
        }
        return o;
      })
      .filter(e => e.image || e.video || e.gfycat);
  }

  extractImage_(data) {
    return {
      image: {
        width: data.thumbnail_width,
        height: data.thumbnail_height,
        src: data.url
      }
    };
  }

  extractGfycat_(data) {
    const match = data.url.match(/^https:\/\/gfycat\.com\/([^\/]+)/);
    if (!match) {
      return {};
    }
    return {
      gfycat: {
        width: data.thumbnail_width,
        height: data.thumbnail_height,
        id: match[1]
      }
    };
  }

  extractVideo_(data) {
    let video;
    if (data.media.reddit_video) {
      video = data.media.reddit_video;
    } else if (data.secure_media.reddit_video) {
      video = data.secure_media.reddit_video;
    }
    return {
      video: {
        poster: this.getPoster_(data),
        src: {
          fallback: video.fallback_url,
          hls: video.hls_url,
          dash: video.dash_url
        }
      }
    };
  }

  guessVideo_(data) {
    return {
      video: {
        poster: this.getPoster_(data),
        src: {
          fallback: `${data.url}/DASH_480.mp4?source=fallback`,
          hls: `${data.url}/HLSPlaylist.m3u8`,
          dash: `${data.url}/DASHPlaylist.mpd`
        }
      }
    };
  }

  getPoster_(data) {
    if (!data.preview || !data.preview.images) {
      return;
    }
    return data.preview.images[0].source.url.replace(/&amp;/g, '&');
  }
}
