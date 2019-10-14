import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { SharedStyles } from '../components/shared-styles'

// This element is connected to the Redux store.
import { store } from '../store';
import { router } from '../routes';

import {
  navigate
} from '../actions/app';

// These are the elements needed by this element.
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-tabs/paper-tab';
import '@polymer/paper-tabs/paper-tabs';
import '@polymer/paper-input/paper-input';
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import '@polymer/paper-button';

import '../components/window-frame';

class MyApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      _title: { type: String }
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: block;
          --body-height: calc(100vh - 35px);
        }

        window-frame {
          background: rgb(39,42,45);
        }

        paper-tabs {
          --paper-tabs-selection-bar-color: var(--app-primary-color);
          max-width: 1100px;
          margin: auto;
        }

        paper-tab {
          color: var(--app-text-color);
          --paper-tab-ink: var(--app-primary-color);
        }

        paper-tab > span {
          font-weight: normal!important;
          text-transform: uppercase;
        }

        app-header {
          position: sticky;
          top: 0;
        }

        [main-title] {
          font-family: 'Pacifico';
          text-transform: lowercase;
          font-size: 30px;
          /* In the narrow layout, the toolbar is offset by the width of the
          drawer button, and the text looks not centered. Add a padding to
          match that button */
          padding-right: 44px;
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
          min-height: calc(var(--body-height) - 48px);
          height: 300vh;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }
      `
    ];
  }

  render() {
    return html`
      <window-frame title="Artsy Gallery - ${this._title}" iconSrc="./images/favicon.ico">
        <app-header condenses reveals effects="waterfall">
          <paper-tabs sticky>
            <paper-tab><span>View 1</span></paper-tab>
            <paper-tab><span>View 2</span></paper-tab>
            <paper-tab><span>View 3</span></paper-tab>
            <paper-tab><span>View 4</span></paper-tab>
            <paper-tab><span>View 5</span></paper-tab>
          </paper-tabs>
        </app-header>

        <main role="main" class="main-content">
        </main>
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
    const header = this.renderRoot.querySelector('app-header');
    const windowFrame = this.renderRoot.querySelector('window-frame');
    windowFrame.addEventListener('firstUpdated', () => {
      const scrollTarget = windowFrame.renderRoot.querySelector('#body');
      header.scrollTarget = scrollTarget;
    })
    router.on('page-change', (page) => {
      store.dispatch(navigate(page));
    });
    router.navigate('dashboard');
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);
  }

  stateChanged(state) {
    this._title = state.app.page._title;
  }
}

window.customElements.define('my-app', MyApp);
