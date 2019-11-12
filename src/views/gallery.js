import { html, css } from 'lit-element';
import { PageViewElement } from '../components/page-view-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { SharedStyles } from '../components/shared-styles';
import fs from "fs";

import { store } from '../store';
import '@polymer/paper-icon-button';
import '@polymer/iron-icons';
import '../components/setting-prompt';
import '../components/grid-container';

class GalleryPage extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          padding: 0!important;
          margin: 0!important;
        }

        :host(.page) {
          max-width: 90vw;
        }

        .grid-container {
          height: calc(100vh - 35px);
        }
      
        .grid-item img {
          width: 100%;
          height: 100%;
          box-shadow: 3px 3px 5px grey;
        }

        .settings-prompt-button {
          position: absolute;
          top: 10px;
          right: 10px;
        }

        @keyframes crawl-top {
          0% {
            transform : translate3d(0,0px,0);
          }
          100% {
            transform : translate3d(0,-100vh,0);
          }
        }

        @keyframes fade-in {
          0% {
            opacity:0;
          }
          100% {
            opacity:1;
          }
        }

        .crawl {
          position: relative;
          animation: crawl-top 100s linear;
        }

        .fade-in {
          animation: fade-in 5s linear;
          opacity:1 !important;
        }
        `
    ];
  }

  render() {
    return html`
      <grid-container class="grid-container" width="${this._width}" height="${this._height}">
        ${this.photos.slice(0, this._width * this._height).map(
          url => html`
            <div
              class="grid-item gallery-image invisible"
              ?hidden=${this._overview}>
              <img
                src="${resolveLocalURL(url)}"
                alt="placeholder image"/>
            </div>
          `
        )}
      </grid-container> 
      
      <settings-prompt 
        .animations='${this._animations}'
        @changed-config='${({detail: {width, height, animation, directories}}) => this.startPresentation(width, height, animation, directories)}'>
      </settings-prompt>

      <paper-icon-button 
        class='settings-prompt-button' 
        icon='settings' 
        ?hidden='${!this._overview}'
        @click='${() => this._toggleSettingsPrompt()}'>
      </paper-icon-button>

      
    `;
  }

  static get properties() {
    return {
      _height: Number,
      _width: Number,
      photos: Array,
      _directory: Array,
      _overview: Boolean,
      _animations: Array
    };
  }

  constructor() {
    super();
    this._width = 0;
    this._height = 0;
    this._overview = true;
    this._directory = [];

    super.style.setProperty('--grid-width', this._width);
    super.style.setProperty('--grid-height', this._height);
    this.photos = [];

    this._animations = [
      {
        name: 'grass',
        description: 'Potat'
      },
      {
        name: 'all',
        description: 'Beweegt alle foto\'s tegelijk naar boven of beneden.'
      },
      {
        name: 'random',
        description: 'Laad de foto\'s willekeurig 1 voor 1 in.'
      },
      {
        name: 'random-expd',
        description: 'Laad de foto\'s willekeurig 1 voor 1 in. \n Met tussentijden die steeds langer zijn.'
      },
      {
        name: 'single-row',
        description: 'Beweegt 1 rij per keer naar links of rechts.'
      },
      {
        name: 'single-kolom',
        description: 'Beweegt 1 kolom per keer naar boven of beneden.'
      },
      {
        name: 'chronological-horizontal',
        description: 'Laad de foto\'s per rij van links naar rechts in.'
      },
      {
        name: 'chronological-vertical',
        description: 'Laad de foto\'s per kolom van boven naar beneden in.'
      }
    ]
    
  }

  updateGrid(width, height, animation) {
    if (width) this._width = width;
    if (height) this._height = height;
    if (animation) this._animation = animation;
  }

  firstUpdated() {
    this._settingsPrompt = this.renderRoot.querySelector('settings-prompt');


    setTimeout(() => {
      this._settingsPrompt.open();
    }, 100);
  }

  startPresentation(width, height, animation, directories) {
    this._overview = false;
    this._directory = directories;
    this.updateGrid(width, height, animation);

    for (const directory of this._directory) {
      fs.readdir(directory, (err, files) => {
        if (err) {
          console.log("Can't get images");
          throw err;
        } else {
          this.photos = files.map(name => `${directory}/${name}`);
        }
      });
    }

    setTimeout(() => {
      this.animateElements(this._height, this._width, this._animation);
    }, 1500);
  }

  animateElements(height, width, animation = 0) {
    let index = 0; 
    let t = height * width;
    let selectedElement = this.renderRoot.querySelectorAll(
      `.gallery-image`
    );
    let layer = [];

    // Willekeurige animatie exponetiele daling

    switch(animation) {
      case 'random-expd':
         // Zet alle items onzichtbaar
        for(let i = 0; i < t; i++){
          selectedElement[i].style.opacity = 0;
        }

        // push voor elke item een 0 in de layer array zodat je een 'map' krijgt.
        for(let i = 0; i < t; i++){layer.push(0);}

        // pak elke seconde 1 number en als die nog niet 1 is fade hem dan in, herhaal dit totdat je er een hebt
        setInterval(function() {
          if (index < t) {
            let number = Math.floor(Math.random() * t);

            if (layer[number] != 1) {
              selectedElement[number].classList.add('fade-in');

              layer[number] = 1;
              index++;
            }
          }
          if(index === t){
            clearInterval();
          }
        }, 1000);
        break;
      case 'random':
        for (let i = 0; i < t; i++) {
          selectedElement[i].style.opacity = 0;
        }
  
        for (let i = 0; i < t; i++) {
          layer.push(0);
        }
        var randomAnimation = setInterval(function() {
          if (index < t) {
            let number = Math.floor(Math.random() * t);
            while (layer[number] == 1) {
              number = Math.floor(Math.random() * t);
            }
  
            if (layer[number] != 1) {
              selectedElement[number].classList.add('fade-in');
              layer[number] = 1;
              index++;
            }
          }
          if(index === t){
            clearInterval(randomAnimation);
          }
        }, 1000);
        break;
        case "grass":
          /*
            keep track if which item are visible by making a grid map
            0 is invisible
            1 is invisible but a contender for making visible
            2 is visible
            example :
            1 0 0 0 0
            1 0 0 0 0
            1 0 0 0 0
            1 0 0 0 0
           */
          for (let items = 0; items < t; items++) {
            selectedElement[items].style.opacity = 0;
            layer.push(0);
          }

          // make a starting seed from which to begin of
          const intialSeed = Math.floor(Math.random() * t);
          let availableItems = [];
          selectedElement[intialSeed].classList.add("fade-in");

          layer[intialSeed] = 2;
          index++;

          if ((intialSeed + 1) % width !== 0 && layer[+intialSeed + 1] === 0) {
            layer[+intialSeed + 1] = 1;
            availableItems.push(+intialSeed + 1);
            //console.log("right", +intialSeed+1);
          }

          if (intialSeed - width >= 0 && layer[+intialSeed - width] === 0) {
            layer[+intialSeed - width] = 1;
            availableItems.push(+intialSeed - width);
            //console.log("up", +intialSeed-width);
          }

          if (intialSeed % width !== 0 && layer[+intialSeed - 1] === 0) {
            layer[+intialSeed - 1] = 1;
            availableItems.push(+intialSeed - 1);
            //console.log("left", +intialSeed-1);
          }

          if (+intialSeed + +width < t && layer[+intialSeed + +width] === 0) {
            layer[+intialSeed + +width] = 1;
            availableItems.push(+intialSeed + +width);
            // console.log("down", +intialSeed + +width);
          }

          let rItem = availableItems.splice(
            Math.floor(Math.random() * availableItems.length),
            1
          );

          selectedElement[rItem[0]].classList.add("fade-in");

          index++;

          var grassAnimate = setInterval(function() {
            if (index < t) {
              if ((rItem + 1) % width !== 0 && layer[+rItem + 1] === 0) {
                layer[+rItem + 1] = 1;
                availableItems.push(+rItem + 1);
                // console.log("right", +rItem + 1);
              }

              if (rItem - width >= 0 && layer[+rItem - width] === 0) {
                layer[+rItem - width] = 1;
                availableItems.push(+rItem - width);
                // console.log("up", +rItem - width);
              }

              if (rItem % width !== 0 && layer[+rItem - 1] === 0) {
                layer[+rItem - 1] = 1;
                availableItems.push(+rItem - 1);
                // console.log("left", +rItem - 1);
              }

              if (+rItem + +width < t && layer[+rItem + +width] === 0) {
                layer[+rItem + +width] = 1;
                availableItems.push(+rItem + +width);
                // console.log("down", +rItem + +width);
              }

              rItem = availableItems.splice(
                Math.floor(Math.random() * availableItems.length),
                1
              );

              selectedElement[rItem[0]].classList.add("fade-in");
            }
            if (index === t) {
              clearInterval(grassAnimate);
            }

            index++;
          }, 500);
        break;
      case 'chronological-horizontal':
        for (let i = 0; i < t; i++) {
          selectedElement[i].style.opacity = 0;
        }
  
        var chronoHorziAnimate = setInterval(function() {
          if (index < t) {
              selectedElement[index].classList.add('fade-in');
              index++;
            }
            if(index === t){
              clearInterval(chronoHorziAnimate);
            }
        }, 1000);
        break;
      case 'chronological-vertical':
        for (let i = 0; i < t; i++) {
          selectedElement[i].style.opacity = 0;
        }
  
        var chronoVertiAnimate = setInterval(function() {
          if (index < t*width) {
            for (let i = 0; i < t; i++) {
              selectedElement[i].style.opacity = 0;
            }
              for(let i = 0; i < height; i++){
                selectedElement[index*width].classList.add('fade-in');
              }
  
              index++;
            }
            if(index === t){
              clearInterval(chronoVertiAnimate);
            }
        }, 1000);
        break;
      case 'single-kolom':
        for (let i = 0; i < height; i++) {
          selectedElement[i * width].classList.add('crawl');
        }
        break;
      case 'single-row':
        for (let i = 0; i < width; i++) {
          selectedElement[i].classList.add('crawl');
        }
        break;
      case 'all':
        for (let i = 0; i < t; i++) {
          selectedElement[i].classList.add('crawl');
        }
        break;
    }

  }

  _toggleSettingsPrompt() {
    this._settingsPrompt.open();
  }
}

window.customElements.define('gallery-page', GalleryPage);
