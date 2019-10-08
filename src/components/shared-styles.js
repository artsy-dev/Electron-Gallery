/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { css } from 'lit-element';

export const SharedStyles = css`
  :host {
    --app-primary-color: rgb(20, 127, 255);
    --app-secondary-color: #293237;
    --app-text-color: rgba(255, 255, 255, 0.8);
    --app-section-even-color: #f7f7f7;
    --app-section-odd-color: white;

    --primary-color: var(--app-primary-color);
    --primary-text-color: var(--app-text-color);
    --secondary-text-color: #777;
  }
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: none;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(255,255,255,0.07);
  }
  [hidden] {
    display: none!important;
  }
`;
