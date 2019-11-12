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
import { targets, defaultTarget } from './targets';
import Mustache from 'mustache';
import fs from 'fs';

const template = fs.readFileSync('./src/template.html', 'utf8');
Mustache.parse(template);

export default class StoryManager {
  constructor({ container, iframe, next, prev, link }) {
    this.container_ = container;
    this.iframe_ = null;
    this.link_ = link;

    this.update_ = this.update_.bind(this);
    this.onNextClick_ = this.onNextClick_.bind(this);
    this.onPrevClick_ = this.onPrevClick_.bind(this);
    this.onStoryPageChange_ = this.onStoryPageChange_.bind(this);

    window.addEventListener('hashchange', this.update_);
    next.addEventListener('click', this.onNextClick_);
    prev.addEventListener('click', this.onPrevClick_);
    this.update_();
  }

  onNextClick_(event) {
    event.preventDefault();
    if (this.irl.nextPage()) {
      this.render_();
    }
  }

  onPrevClick_(event) {
    event.preventDefault();
    if (this.irl.prevPage()) {
      this.render_();
    }
  }

  onStoryPageChange_(currentPage) {
    const id = currentPage.getAttribute('data-reddit-id');
    const { title, permalink } = this.itemMap_.get(id);
    this.link_.textContent = title;
    this.link_.setAttribute('href', permalink);
  }

  async update_() {
    if (!targets[window.location.hash]) {
      window.location.hash = defaultTarget;
    }
    this.target_ = targets[window.location.hash];
    this.container_.className = '';
    await this.display_();
    this.container_.className = 'loaded';
  }

  async display_() {
    this.irl = new RedditService(this.target_.url);
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
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    iframe.style.display = 'none';
    return iframe;
  }
}
