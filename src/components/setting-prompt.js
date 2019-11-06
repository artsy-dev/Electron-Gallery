import { LitElement, html, css } from 'lit-element';

import '@polymer/paper-dialog';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item';
import '@polymer/paper-listbox';
import '@polymer/iron-icon';
import '@polymer/paper-tooltip';
import { repeat } from 'lit-html/directives/repeat';

class SettingsPrompt extends LitElement {
  static get styles () {
    return [
      css`
        :root {
          --grid-width;
          --grid-height;
        }

        :host {
          display: flex;
          position: absolute;
          top: 50%;
          left: 50%;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(var(--grid-width), 1fr);
          grid-template-rows: repeat(var(--grid-height), 1fr);
          grid-column-gap: 2px;
          grid-row-gap: 2px;
        }

        .wireframe {
          position: absolute;
          right: 10px;
          top: 75px;
          height: 100px;
          width: 200px;
        }

        .grid-item {
          border: 1px solid black;
        }

        paper-dialog.dialog {
          height: 40vh;
          width: 50vw;
          overflow: hidden;
        }

        .size-input {
          width: 80px;
        }

        .buttons {
          position: absolute;
          bottom: 0;
          right: 0;
        }

        #help-icon:hover {
          cursor: pointer;
        }
      `
    ]
  }

  render() {
    return html`
      <paper-dialog class="dialog">
        <h2 class="dialog-title">Animatie opties</h2>
        <paper-input class="size-input" min="0" type="number" label="Breedte" @change="${e => this.setWidth(e)}"></paper-input>
        <paper-input class="size-input" min="0" type="number" label="Hoogte" @change="${e => this.setHeight(e)}"></paper-input>
        <paper-dropdown-menu label="Animaties" vertical-offset="55" @selected-item-changed="${e => this.setAnimation(e)}">
          <paper-listbox slot="dropdown-content">
            ${repeat(
              this.animations,
              animation => html`
              <paper-item>${animation.name}</paper-item>         
              `)}
          </paper-listbox>
        </paper-dropdown-menu>
        
        <iron-icon icon="help-outline" id="help-icon" tab-index="0"></iron-icon>
        <paper-tooltip class="tooltip" for="help-icon" position="right" offset="0" animation-delay="0">
          ${this._description || "Kies een animatie"}
        </paper-tooltip>

        <div class="wireframe grid-container">
          ${repeat(new Array(this._height * this._width), () => html`<div class="grid-item"></div>`)}
        </div>

        <div class="buttons">
          <paper-button @click="${this.saveConfig}" dialog-confirm>Opslaan</paper-button>
          <paper-button dialog-dismiss>Close</paper-button>
        </div>
      </paper-dialog>
    `;
  }

  static get properties() {
    return {
      _height: Number,
      _width: Number,
      _animation: String,
      animations: Array,
      _description: String
    }
  }

  constructor() {
    super();
    this._height = 0;
    this._width = 0;
    this._animation = "";

    super.style.setProperty("--grid-height", this._height);
    super.style.setProperty("--grid-width", this._width);
  }

  setHeight(e) {
    this._height = e.target.value;
    super.style.setProperty("--grid-height", this._height);
  }

  setWidth(e) {
    this._width = e.target.value;
    super.style.setProperty("--grid-width", this._width);
  }

  setAnimation(e) {
    this._animation = e.target.value.toLowerCase();
    this._setAnimationDescription();
  }

  _setAnimationDescription() {
    this._description = this.animations.find((animation) => {return animation.name === this._animation}).description;
  }

  saveConfig() {
    this.dispatchEvent(
      new CustomEvent('changed-config', 
      { 
        detail: {
          height: this._height, 
          width: this._width, 
          animation: this._animation
        }
      })
    )
  }

  open() {
    this.renderRoot.querySelector('paper-dialog').open();
  }
}

window.customElements.define('settings-prompt', SettingsPrompt);