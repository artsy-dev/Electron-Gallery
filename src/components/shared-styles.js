import { css } from 'lit-element';

export const SharedStyles = css`
  :host {
    --shadow-elevation-2dp: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px;
    --shadow-elevation-3dp: rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px, rgba(0, 0, 0, 0.4) 0px 3px 3px -2px;
    --shadow-elevation-4dp: rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px, rgba(0, 0, 0, 0.4) 0px 2px 4px -1px;
    --shadow-elevation-6dp: rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px, rgba(0, 0, 0, 0.4) 0px 3px 5px -1px;
    --shadow-elevation-8dp: rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px, rgba(0, 0, 0, 0.4) 0px 5px 5px -3px;
    --shadow-elevation-12dp: rgba(0, 0, 0, 0.14) 0px 12px 16px 1px, rgba(0, 0, 0, 0.12) 0px 4px 22px 3px, rgba(0, 0, 0, 0.4) 0px 6px 7px -4px;
    --shadow-elevation-16dp: rgba(0, 0, 0, 0.14) 0px 16px 24px 2px, rgba(0, 0, 0, 0.12) 0px 6px 30px 5px, rgba(0, 0, 0, 0.4) 0px 8px 10px -5px;

    --app-primary-color: rgb(20, 127, 255);
    --app-secondary-color: #293237;
    --app-text-color: black;
    --app-section-even-color: #f7f7f7;
    --app-section-odd-color: white;

    --primary-color: var(--app-primary-color);
    --primary-text-color: var(--app-text-color);
    --secondary-text-color: #777;
  }
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: none;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(255,255,255,0.07);
  }
  [hidden] {
    display: none!important;
  }
  h1 {
    color: var(--app-text-color);
    font-weight: 400;
    font-size: 24px;
  }
  h2 {
    color: var(--app-primary-color);
    font-weight: 400;
    font-size: 20px;
  }
  h3 {
    color: var(--app-text-color);
    font-weight: 400;
    font-size: 18px;
  }
  h4 {
    color: var(--app-text-color);
    font-size: 16px;
    font-weight: 500;
  }
  p {
    color: var(--app-text-color);
    font-family: 'Noto Sans';
    font-size: 16px;
  }
`;
