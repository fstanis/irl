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

import StoryManager from './StoryManager';

async function load() {
  new StoryManager(findElements());
  window.scrollTo(0, 1);
}

function findElements() {
  return {
    container: document.querySelector('#container'),
    iframe: document.querySelector('#story'),
    next: document.querySelector('#next'),
    fullscreen: document.querySelector('#fullscreen')
  };
}

if (
  document.readyState === 'complete' ||
  document.readyState === 'interactive'
) {
  load();
} else {
  document.addEventListener('DOMContentLoaded', load);
}
