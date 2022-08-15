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

import RedditService from './RedditService';
import { modes, defaultMode } from './targets';
import Mustache from 'mustache';
import fs from 'fs';

const template = fs.readFileSync('./src/template.html', 'utf8');
Mustache.parse(template);

export default class StoryManager {
  constructor({ container, iframe, next, fullscreen }) {
    this.container_ = container;
    this.iframe_ = null;
    this.isFullscreen_ = false;
    this.next_ = next;
    this.mode_ = defaultMode;

    window.addEventListener('hashchange', this.update_);
    window.addEventListener('resize', this.resize_);
    fullscreen.addEventListener('click', this.fullscreen_);
    this.resize_();
    this.update_();
  }

  onStoryPageChange_ = (currentPage) => {
    // unused
  };

  update_ = async () => {
    const parsedHash = new URLSearchParams(window.location.hash.substring(1));
    this.mode_ = parsedHash.get('mode') || defaultMode;
    this.after_ = parsedHash.get('after') || '';
    this.useNew_ = parsedHash.has('new');
    this.target_ = modes[this.mode_];
    this.container_.className = '';
    await this.display_();
    this.container_.className = 'loaded';
  };

  resize_ = () => {
    this.container_.style.height = window.innerHeight + 'px';
  };

  fullscreen_ = () => {
    if (!this.isFullscreen_) {
      this.isFullscreen_ = true;
      document.documentElement.requestFullscreen();
    } else {
      this.isFullscreen_ = false;
      document.exitFullscreen();
    }
  };

  async display_() {
    this.irl = new RedditService(this.target_.url, this.after_, this.useNew_);
    await this.render_();
  }

  async render_() {
    const items = await this.irl.fetch();
    const page = Mustache.render(template, {
      taget: this.target_.title,
      canonical: window.location.href,
      items
    });
    this.itemMap_ = new Map(items.map(e => [e.id, e]));
    const blob = new Blob([page], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const iframe = this.createIframe_();
    iframe.setAttribute('src', url);
    this.container_.prepend(iframe);

    await new Promise(resolve => iframe.addEventListener('load', resolve));
    URL.revokeObjectURL(url);

    if (this.iframe_) {
      this.container_.removeChild(this.iframe_);
    }
    this.iframe_ = iframe;
    iframe.style.display = '';

    this.registerPageChange_(this.onStoryPageChange_);

    let nextUrl = `#mode=${this.mode_}&after=${this.irl.nextAfter()}`;
    if (this.useNew_) {
      nextUrl += '&new';
    }
    this.next_.href = nextUrl;
  }

  registerPageChange_(callback) {
    const story = this.iframe_.contentDocument.querySelector('amp-story');
    const observer = new MutationObserver(mutations => {
      const current = mutations
        .map(m => m.target)
        .find(t => t.tagName === 'AMP-STORY-PAGE' && t.hasAttribute('active'));
      if (current) {
        callback(current);
      }
    });
    observer.observe(story, { subtree: true, attributeFilter: ['active'] });
  }

  createIframe_() {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');
    iframe.style.display = 'none';
    return iframe;
  }
}
