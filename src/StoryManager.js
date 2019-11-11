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
  constructor({ container, iframe, next }) {
    this.container = container;
    this.iframe = iframe;

    this.update_ = this.update_.bind(this);
    this.onNextClick_ = this.onNextClick_.bind(this);
    this.onStoryPageChange_ = this.onStoryPageChange_.bind(this);

    window.addEventListener('hashchange', this.update_);
    next.addEventListener('click', this.onNextClick_);
    this.update_();
  }

  onNextClick_(event) {
    event.preventDefault();
    this.irl.nextPage();
    this.render_(irl, target.title, iframe);
  }

  onStoryPageChange_(currentPage) {
    console.log(currentPage);
  }

  async update_() {
    if (!targets[window.location.hash]) {
      window.location.hash = defaultTarget;
    }
    const target = targets[window.location.hash];
    this.container.className = '';
    await this.display_(target);
    this.container.className = 'loaded';
  }

  async display_(target) {
    this.irl = new RedditService(target.url);
    await this.render_(target.title);
  }

  async render_(title) {
    const items = await this.irl.fetch();
    const page = Mustache.render(template, {
      title,
      canonical: window.location.href,
      items
    });
    const blob = new Blob([page], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this.iframe.setAttribute('src', url);
    await new Promise(resolve => this.iframe.addEventListener('load', resolve));
    URL.revokeObjectURL(url);
    this.registerPageChange_(this.onStoryPageChange_);
  }

  registerPageChange_(callback) {
    const story = this.iframe.contentDocument.querySelector('amp-story');
    const observer = new MutationObserver(mutations => {
      const current = mutations
        .map(m => m.target)
        .find(t => t.tagName === 'AMP-STORY-PAGE' && t.hasAttribute('active'));
      callback(current);
    });
    observer.observe(story, { subtree: true, attributeFilter: ['active'] });
  }
}
