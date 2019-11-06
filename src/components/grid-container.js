import { html, css, LitElement } from 'lit-element'

class GridContainer extends LitElement {
  static get properties() {
    return {
      width: { type: Number },
      height: { type: Number },
      gap: { type: Number },
      padding: { type: Number },
      aspectRatio: { type: Number, attribute: 'aspect-ratio' }      
    }
  }

  static get styles () {
    return css `
      :host {
        width: 100vw;
        height: 100vh;
        display: flex;
      }

      #container {
        position: relative;
        flex-grow: 1;
      }

      ::slotted(*) {
        position: absolute;
      }
    `
  }

  render () {
    return html`
      <div id="container">
        <slot></slot>
      </div>
    `
  }

  firstUpdated() {
    this._container = this.renderRoot.getElementById('container');
    this.resize();
    const resizeObserver = new ResizeObserver(() => this.resize());
    const mutationObserver = new MutationObserver(() => this.resize());
    resizeObserver.observe(this);
    mutationObserver.observe(this, {
      childList: true
    })
  }

  updated() {
    this.resize();
  }

  resize () {
    if(!this._resizeScheduled) {
      this._resizeScheduled = true;
      requestAnimationFrame(() => {
        this._resizeScheduled = false;
        const gridWidth = this.width || 5;
        const gridHeight = this.height || 4;
        const padding = this.padding || 60;
        const gap = this.gap || 10;
        const aspectRatio = this.aspectRatio || 0.5625;

        const pics = [...this.children];
        const { width, height } = this._container.getBoundingClientRect()
        const picAreaWidth = width - padding * 2;
        const picAreaHeight = height - padding * 2;
        const picMaxWidth = (picAreaWidth - (gap * (gridWidth - 1))) / gridWidth;
        const picMaxHeight = (picAreaHeight - (gap * (gridHeight - 1))) / gridHeight;
        let picWidth;
        let picHeight;

        if(picMaxWidth * aspectRatio > picMaxHeight) {
          picWidth = picMaxHeight / aspectRatio;
          picHeight = picMaxHeight;
        } else {
          picWidth = picMaxWidth;
          picHeight = picMaxWidth * aspectRatio;
        }

        const paddingLeft = (width - (picWidth * gridWidth) - ((gridWidth - 1) * gap)) / 2;
        const paddingTop = (height - (picHeight * gridHeight) - ((gridHeight - 1) * gap)) / 2;

        for(let x = 0; x < gridWidth; x++) {
          for(let y = 0; y < gridHeight; y++) {
            const n = (y * gridWidth) + x;
            const pic = pics[n];
            if(pic) {
              pic.style.left = paddingLeft + (x * (picWidth + gap)) + 'px';
              pic.style.top = paddingTop + (y * (picHeight + gap)) + 'px';
              pic.style.maxWidth = pic.style.width = picWidth + 'px';
              pic.style.maxHeight = pic.style.height = picHeight + 'px';
            }
          }
        }
      })
    }
  }
}

window.customElements.define('grid-container', GridContainer);