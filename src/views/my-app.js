import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { SharedStyles } from '../components/shared-styles'

// This element is connected to the Redux store.
import { store } from '../store';
import { router } from '../routes';

import {
  navigate,
  setPages
} from '../actions/app';

console.log(router);

// These are the elements needed by this element.
import '../components/window-frame';
import '../components/view-container';

class MyApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      _title: { type: String },
      _page: { type: Object }
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: block;
          --body-height: calc(100vh - 35px);
          
          --app-primary-color: #172c50;

          --app-header-background-color: rgba(255,255,255,0.9);
          --app-header-text-color: black;
          
          --app-drawer-width: 256px;

          --paper-badge-background: rgb(23, 44, 80);
        }

        window-frame {
          background: rgb(39,42,45);
          --frame-header-background: #1d1f22;
        }

        [hidden] {
          display: none;
        }

        .underline {
          transition: color 0.2s ease-in-out;
        }

        .underline:hover {
          color: black;
        }
      `
    ];
  }

  render() {
    return html`
      <window-frame 
        title="Artsy Gallery - ${this._title}"
        icon-src="./images/manifest/icon-72x72.png">
        <view-container page="${this._page.tagName}"></view-container>
     </window-frame>
    `;
  }

  update(changedProps) {
    if(changedProps.has('_page')) {
      updateMetadata({
        title: 'Artsy Gallery - ' + this._title,
        description: 'Artsy Gallery - ' + this._title
      })
    }
    super.update(changedProps);
  }

  firstUpdated() {
    store.dispatch(setPages(router.resolveAll()));
    router.on('page-change', (page) => {
      store.dispatch(navigate(page));
      windowFrame.scrollUp();
    });
    router.navigate('gallery');
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);
  }

  stateChanged({app: {page = {}}}) {
    this._title = page.title;
    this._page = page;
  }
}

window.customElements.define('my-app', MyApp);
