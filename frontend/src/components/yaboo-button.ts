import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('yaboo-button')
export class YabooButton extends LitElement {
  @property({ type: String }) variant: 'solid' | 'outline' | 'text' = 'solid';
  @property({ type: String }) size: 'large' | 'medium' | 'small' | 'x-small' = 'medium';
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';

  static styles = css`
    :host {
      display: inline-block;
    }

    .button {
      font-family: 'Noto Sans JP', sans-serif;
      font-weight: 700;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      white-space: nowrap;
      text-align: center;
      box-sizing: border-box;
    }

    .button:disabled {
      cursor: not-allowed;
    }

    /* Size variants */
    .button--large {
      padding: 16px 24px;
      font-size: 18px;
      line-height: 1.6;
      border-radius: 8px;
    }

    .button--medium {
      padding: 12px 20px;
      font-size: 16px;
      line-height: 1;
      border-radius: 8px;
    }

    .button--small {
      padding: 8px 16px;
      font-size: 14px;
      line-height: 1;
      border-radius: 4px;
    }

    .button--x-small {
      padding: 6px 12px;
      font-size: 14px;
      line-height: 1;
      border-radius: 4px;
    }

    /* Solid variant (塗りつぶしボタン) */
    .button--solid {
      background-color: #0017c1;
      color: #ffffff;
      border: 2px solid #0017c1;
    }

    .button--solid:hover:not(:disabled) {
      background-color: #00118f;
      border-color: #00118f;
    }

    .button--solid:active:not(:disabled) {
      background-color: #000060;
      border-color: #000060;
    }

    .button--solid:focus:not(:disabled) {
      background-color: #000060;
      border-color: #000060;
      outline: 4px solid #ffd43d;
      outline-offset: 2px;
    }

    .button--solid:disabled {
      background-color: #b3b3b3;
      border-color: #b3b3b3;
      color: #ffffff;
    }

    /* Outline variant (アウトラインボタン) */
    .button--outline {
      background-color: transparent;
      color: #0017c1;
      border: 2px solid #0017c1;
    }

    .button--outline:hover:not(:disabled) {
      background-color: #e8f1fe;
      color: #00118f;
      border-color: #00118f;
    }

    .button--outline:active:not(:disabled) {
      background-color: #c5d7fb;
      color: #000060;
      border-color: #000060;
    }

    .button--outline:focus:not(:disabled) {
      background-color: #c5d7fb;
      color: #000060;
      border-color: #000060;
      outline: 4px solid #ffd43d;
      outline-offset: 2px;
    }

    .button--outline:disabled {
      background-color: transparent;
      border-color: #b3b3b3;
      color: #b3b3b3;
    }

    /* Text variant (テキストボタン) */
    .button--text {
      background-color: transparent;
      color: #0017c1;
      border: 2px solid transparent;
      text-decoration: underline;
      text-underline-offset: 20%;
    }

    .button--text:hover:not(:disabled) {
      color: #00118f;
      background-color: #f2f2f2;
    }

    .button--text:active:not(:disabled) {
      color: #000060;
      background-color: #e8f1fe;
    }

    .button--text:focus:not(:disabled) {
      color: #000060;
      background-color: #ffd43d;
      outline: 4px solid #000000;
      outline-offset: 2px;
      text-decoration: none;
    }

    .button--text:disabled {
      color: #b3b3b3;
      background-color: transparent;
    }
  `;

  render() {
    const classes = [
      'button',
      `button--${this.variant}`,
      `button--${this.size}`
    ].join(' ');

    return html`
      <button
        class="${classes}"
        ?disabled="${this.disabled}"
        type="${this.type}"
        @click="${this._handleClick}"
      >
        <slot></slot>
      </button>
    `;
  }

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    this.dispatchEvent(new CustomEvent('yaboo-button-click', {
      bubbles: true,
      composed: true,
      detail: { originalEvent: e }
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'yaboo-button': YabooButton;
  }
}