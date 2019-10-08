import { LitElement, html, css } from 'lit-element';
import { remote } from 'electron';
import { SharedStyles } from '../components/shared-styles';

window.remote = remote;

class WindowFrame extends LitElement {

  static get styles () {
    return [
      SharedStyles,
      css`
        :host {
          background: var(--frame-header-background, white);
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        #frame {
          display: flex;
          height: 35px;
        }

        #body {
          height: calc(100vh - 35px);
          overflow: auto;
          position: relative;
        }

        #drag-container {
          -webkit-app-region: drag;
          flex-grow: 1;
          display: flex;
          color: #9da5b4;
          align-items: center;
        }

        #resizer {
          -webkit-app-region: no-drag;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
        }

        #icon {
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 35px;
          padding-right: 10px;
        }

        #icon > img {
          width: 24px;
          height: 24px;
        }

        #window-buttons {
          display: flex;
        }

        #window-buttons > * > * {
          width: 54px;
          height: 35px;
          background: #9da5b4;
        }

        #window-buttons > :hover {
          background: rgba(255,255,255,0.15);
        }

        #close-btn > div {
          -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%
        }

        #maximize-btn[maximized] > div {
          -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
        }

        #maximize-btn > div {
          -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
        }

        #minimize-btn > div {
          -webkit-mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E") no-repeat 50% 50%;
        }
        
        #close-btn:hover {
          background: #d41324;
        }

        #close-btn:hover div {
          background: white;
        }

      `
    ]
  }

  render() {
    return html`
      <div id="frame" ?hidden="${this._fullscreen}">
        <div id="drag-container">
          <div id="icon">
            <img src="${this.iconSrc}">
          </div>
          <span id="title">
            ${this.title || ''}
          </span>
          <div id="resizer" ?hidden="${this._maximized}"></div>
        </div>
        <div id="window-buttons">
          <div id="minimize-btn" @click="${this._minimize}">
            <div></div>
          </div>
          <div id="maximize-btn" ?maximized="${this._maximized}" @click="${this._maximize}">
            <div></div>
          </div>
          <div id="close-btn" @click="${this._close}">
            <div></div>
          </div>
        </div>
      </div>
      <div id="body">
        <slot></slot>
      </div>
    `
  }

  firstUpdated() {
    this.dispatchEvent(new CustomEvent('firstUpdated'))
  }

  static get properties () {
    return {
      title: { type: String },
      iconSrc: { type: String },
      _maximized: { type: Boolean },
      _fullscreen: { type: Boolean }
    }
  }

  _minimize () {
    var window = remote.getCurrentWindow();
    window.minimize(); 
  }

  _maximize () {
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
      window.maximize();
    } else {
      window.unmaximize();
    }
  }

  _close () {
    var window = remote.getCurrentWindow();
    window.close();
  }

  constructor() {
    super();
    var window = remote.getCurrentWindow()
    this._maximized = window.isMaximized();
    this._fullscreen = window.isFullScreen()
    window.on('maximize', () => {
      this._maximized = true;
    });
    window.on('unmaximize', () => {
      this._maximized = false;
    })
    window.on('enter-full-screen', () => {
      this._fullscreen = true;
    })
    window.on('leave-full-screen', () => {
      this._fullscreen = false;
    })
  }
}

window.customElements.define('window-frame', WindowFrame);