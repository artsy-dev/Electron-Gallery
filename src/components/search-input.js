import { LitElement, html, css } from 'lit-element';

// This element is *not* connected to the Redux store.
class SearchInput extends LitElement {
  static get properties() {
    return {
      placeholder: { type: String },
      prefix: { type: Boolean },
      suffix: { type: Boolean },
    };
  }

  static get styles () {
    return [
      css`
        :host {
          --search-input-focused-color: var(--primary-color, #3f51b5);
          --search-input-unfocused-color: var(--secondary-text-color, #555);
          display: block;
          width: 340px;
          color: black;
          padding-bottom: 1px;
        }

        input {
          border: none;
          background: none;
          font-size: 16px;
          color: inherit;
          padding: 12px 15px 10px;
          width: 100%;
        }

        input:focus {
          outline: none;
        }

        input::placeholder {
          color: var(--search-input-unfocused-color);
        }

        #input-container {
          background: rgba(255,255,255,0.07);
          position: relative;
          border-bottom: 1px solid var(--search-input-unfocused-color);
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          display: flex;
          align-items: center;
        }

        #input-container::after {
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          content: '';
          background: var(--search-input-focused-color);
          height: 2px;
          transform: scaleX(0);
        }

        #input-container:focus-within::after {
          left: 0;
          transform: scaleX(1);
          animation: underline 0.225s ease-out;
        }

        @keyframes underline {
          from {transform: scaleX(0)}
          to {transform: scaleX(1)}
        }

        #suffix,
        #prefix {
          padding: 0 8px 0 7px;
          height: 40px;
          display: flex;
          align-items: center;
          display: none;
        }

        #prefix {
          padding: 0 7px 0 8px;
        }

        :host([prefix]) #prefix,
        :host([suffix]) #suffix {
          display: flex;
        }

        :host([prefix="clickable"]) #prefix,
        :host([suffix="clickable"]) #suffix {
          cursor: pointer;
        }

        :host([prefix]) input {
          padding-left: 0;
        }

        :host([suffix]) input {
          padding-right: 0;
        }
      `
    ]
  }

  render() {
    return html`
      <div id="input-container">
        <div id="prefix" @click="${() => this._prefixClicked()}">
          <slot name="prefix"></slot>
        </div>
        <input placeholder="Search..." @change="${e => this._reDispatch(e)}">
        <div id="suffix" @click="${() => this._suffixClicked()}">
          <slot name="suffix"></slot>
        </div>
      </div>
    `;
  }

  _reDispatch(e) {
    this.dispatchEvent(new Event(e.type, e));
  }

  _suffixClicked() {
    this.dispatchEvent(new CustomEvent('suffix-click'));
  }

  _prefixClicked() {
    this.dispatchEvent(new CustomEvent('suffix-click'));
  }
}

window.customElements.define('search-input', SearchInput);
