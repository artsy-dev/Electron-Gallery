import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { SharedStyles } from '../components/shared-styles'

// This element is connected to the Redux store.
import { store } from '../store.js';

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

import '../components/snack-bar.js';
import '../components/window-frame';
import '../components/search-input';

class MyApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean }
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

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
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
      <window-frame title="${this.appTitle + ' - ' + this._page}" iconSrc="./images/favicon.ico">
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
          <my-view1 class="page" ?active="${this._page === 'view1'}"></my-view1>
          <my-view2 class="page" ?active="${this._page === 'view2'}"></my-view2>
          <my-view3 class="page" ?active="${this._page === 'view3'}"></my-view3>
          <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
        </main>
      </window-frame>
    `;
  }

  update(changedProps) {
    if(changedProps.has('_page')) {
      updateMetadata({
        title: this.appTitle + ' - ' + this._page,
        description: this.appTitle + ' - ' + this._page
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
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);
  }

  stateChanged(state) {
    this._page = state.app.page;
  }
}

window.customElements.define('my-app', MyApp);
