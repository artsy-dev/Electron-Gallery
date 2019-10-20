import { LitElement, html, css } from 'lit-element';
import { remote } from 'electron';
import { SharedStyles } from '../components/shared-styles';

const remoteWindow = remote.getCurrentWindow();

window.remote = remoteWindow;

class WindowFrame extends LitElement {

  static get styles () {
    return [
      SharedStyles,
      css`
        :host {
          width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          --frame-scrollbar-color: var(--primary-color, black);
          --content-height: calc(100vh - 36px);
        }

        :host([maximized]){
          --content-height: calc(100vh - 35px);
        }

        :host([fullscreen]) {
          --content-height: 100vh;
        }

        :host([fullscreen]) #frame {
          display: none;
        }

        #frame {
          background: var(--frame-header-background, transparent);
          display: flex;
          height: 35px;
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

        :host([maximized]) #resizer {
          display: none;
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

        :host([maximized]) #maximize-btn > div {
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

        #body {
          overflow: hidden;
          height: var(--content-height);
          position: relative;
          border: 1px solid var(--frame-header-background, transparent);
          border-top: none;
        }

        :host([maximized]) #body,
        :host([fullscreen]) #body {
          border: none;
        }

        #scroll-container {
          height: var(--content-height);
          overflow: auto;
          position: relative;
        }

        #scroll-container::-webkit-scrollbar {
          display: none;
        }

        :host([hide-scrollbar]) #scrollbar {
          display: none;
        }

        #scrollbar {
          position: absolute;
          right: 0;
          top: 0;
          width: 4px;
          background: var(--frame-scrollbar-color);
          z-index: 99999;
          opacity: 1;
          pointer-events: none;
          box-shadow: var(--shadow-elevation-12dp);
        }

        #scrollbar[invisible] {
          animation: disappear 0.5s ease-out;
          opacity: 0;
        }

        @keyframes disappear {
          from {
            opacity: 1;
          };
          to {
            opacity: 0;
          };
        }
      `
    ]
  }

  render() {
    return html`
      <div id="frame">
        <div id="drag-container">
          <div id="icon">
            <img src="${this.iconSrc}">
          </div>
          <span id="title">
            ${this.title || ''}
          </span>
          <div id="resizer"></div>
        </div>
        <div id="window-buttons">
          <div id="minimize-btn" @click="${this.minimize}">
            <div></div>
          </div>
          <div id="maximize-btn" @click="${() => this._toggleMaximize()}">
            <div></div>
          </div>
          <div id="close-btn" @click="${this._close}">
            <div></div>
          </div>
        </div>
      </div>
      <div id="body">
        <div id="scroll-container">
          <div id="content">
            <slot></slot>
          </div>
        </div>
        <div id="scrollbar"></div>
      </div>
    `
  }

  firstUpdated() {
    this.dispatchEvent(new CustomEvent('firstUpdated'));
    const scrollBar = this.renderRoot.getElementById('scrollbar');
    const scrollContainer = this.renderRoot.getElementById('scroll-container');
    const content = this.renderRoot.getElementById('content');

    let containerHeight = scrollContainer.clientHeight;
    let contentHeight = content.clientHeight;
    let showScrollBar = null;
    let timeoutId = null;
    let invisible = false;

    const observer = new ResizeObserver(entries => {
      for(const { target, contentRect: { height }} of entries) {
        if(target === scrollContainer) {
          containerHeight = height;
        } else if (target === content) {
          contentHeight = height;
        }
      }
      setHeight();
    });

    observer.observe(content);
    observer.observe(scrollContainer);

    const setScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollbarHeight = Math.floor((containerHeight / contentHeight) * containerHeight);
      const scrollPercentage = scrollTop / (contentHeight - containerHeight);
      const scrollSpace = containerHeight - scrollbarHeight;
      const topOffset = Math.floor(scrollPercentage * scrollSpace);
      scrollBar.style.transform = `translateY(${topOffset}px)`;
      if(invisible) scrollBar.removeAttribute('invisible');
      clearTimeout(timeoutId);
      setTimeout(() => {
        invisible = true;
        scrollBar.setAttribute('invisible', '');
      }, 1500);
    }

    const setHeight = () => {
      if(contentHeight > containerHeight && !this.hideScrollbar) {
        if(!showScrollBar) scrollBar.removeAttribute('hidden');
        scrollBar.style.height = `${Math.floor((containerHeight / contentHeight) * containerHeight)}px`;
        showScrollBar = true;
        setScroll();
      } else {
        if(showScrollBar) scrollBar.setAttribute('hidden', '');
        showScrollBar = false;
      }
    }

    scrollContainer.addEventListener('scroll', () => !this.hideScrollbar && setScroll());
  }

  static get properties () {
    return {
      title: { type: String },
      iconSrc: { type: String, attribute: 'icon-src' },
      hideScrollbar: { type: Boolean, attribute: 'hide-scrollbar', reflect: true },
      maximized: { type: Boolean, reflect: true },
      fullscreen: { type: Boolean, reflect: true }
    }
  }

  minimize () {
    remoteWindow.minimize(); 
  }

  _toggleMaximize () {
    this.maximized = !this.maximized;
  }

  set maximized (value) {
    if(typeof value !== 'boolean') return;
    this._updateMaximized(value, true);
  }
  
  get maximized () {
    return this._maximized;
  }

  set fullscreen (value) {
    if(typeof value !== 'boolean') return;
    this._updateFullscreen(value, true);
  }

  get fullscreen () {
    return this._fullscreen;
  }

  _updateMaximized (value, updateRemoteWindow) {
    if(this._maximized !== value) {
      const oldValue = this._maximized;
      this._maximized = value;
      if(updateRemoteWindow) {
        if(value) {
          remoteWindow.maximize();
        } else {
          remoteWindow.unmaximize();
        }
      }
      this.requestUpdate('maximized', oldValue);
      if(value) {
        this.dispatchEvent(new Event('maximized'));
      } else {
        this.dispatchEvent(new Event('un-maximized'));
      }
    }
  }

  _updateFullscreen (value, updateRemoteWindow) {
    if(this._fullscreen !== value) {
      const oldValue = this._fullscreen;
      this._fullscreen = value;
      if(updateRemoteWindow) {
        remoteWindow.setFullScreen(value);
      }
      this.requestUpdate('fullscreen', oldValue);
      if(value) {
        this.dispatchEvent(new Event('fullscreen'));
      } else {
        this.dispatchEvent(new Event('exit-fullscreen'));
      }
    }
  }

  _close () {
    remoteWindow.close();
  }

  constructor() {
    super();
    var window = remote.getCurrentWindow()
    this._updateFullscreen(window.isFullScreen());
    this._updateMaximized(window.isMaximized());
    window.on('maximize', () => this._updateMaximized(true));
    window.on('unmaximize', () => this._updateMaximized(false));
    window.on('enter-full-screen', () => this._updateFullscreen(true));
    window.on('leave-full-screen', () => this._updateFullscreen(false));
  }

  scrollUp(behavior = 'auto') {
    this.renderRoot.getElementById('scroll-container').scrollTo({top: 0, behavior});
  }
}

window.customElements.define('window-frame', WindowFrame);