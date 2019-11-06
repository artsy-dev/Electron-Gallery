import { LitElement, html, css } from 'lit-element';
import './page-view-element';

class ViewContainer extends LitElement {
  constructor() {
    super();
    this._routerInstalled = false;
    this._pageElements = {};
  }

	static get styles () {
		return css`
			:host {
				display: block;
				position: relative;
			}
      :not([active]) {
        display: none;
      }
		`
	} 

  render () {
		if(typeof this.page === 'string') {
      if(!(this.page in this._pageElements)) {
        const elem = document.createElement(this.page);
        elem.className = 'page';
        this._pageElements[this.page] = elem;
      }
		}

		for(const [id, element] of Object.entries(this._pageElements)) {
			if(id === this.page) {
        element.setAttribute('active','');
			} else {
        element.removeAttribute('active');
			}
		}

    return html`
      ${Object.values(this._pageElements)}
    `;
  }

  static get properties () {
    return {
      page: String
    };
  }
}

customElements.define('view-container', ViewContainer);