import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { apiService } from '../services/api.js';

@customElement('login-form')
export class LoginForm extends LitElement {
  @state() private customerId = '';
  @state() private password = '';
  @state() private loading = false;
  @state() private error = '';
  @state() private isLoggedIn = false;

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
    }

    .login-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .login-button {
      width: 100%;
      padding: 0.75rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .login-button:hover {
      background: #0056b3;
    }

    .login-button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .logout-button {
      background: #dc3545;
    }

    .logout-button:hover {
      background: #c82333;
    }

    .error {
      color: #dc3545;
      background: #f8d7da;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
    }

    .logged-in-info {
      text-align: center;
      padding: 1rem;
      background: #d4edda;
      color: #155724;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .demo-accounts {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .demo-accounts h4 {
      margin: 0 0 0.5rem 0;
      color: #495057;
    }

    .demo-accounts p {
      margin: 0.25rem 0;
      color: #666;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    const customerId = localStorage.getItem('customerId');
    this.isLoggedIn = !!customerId;
    if (customerId) {
      this.customerId = customerId;
    }
  }

  private async login() {
    if (!this.customerId || !this.password) {
      this.error = '顧客IDとパスワードを入力してください';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const customer = await apiService.getCustomer(this.customerId);
      
      if (customer.password === this.password) {
        localStorage.setItem('customerId', this.customerId);
        this.isLoggedIn = true;
        this.dispatchEvent(new CustomEvent('login-success', {
          detail: { customerId: this.customerId },
          bubbles: true,
          composed: true
        }));
      } else {
        this.error = 'パスワードが正しくありません';
      }
    } catch (error) {
      this.error = '顧客IDが見つかりません';
      console.error('Login failed:', error);
    } finally {
      this.loading = false;
    }
  }

  private logout() {
    localStorage.removeItem('customerId');
    this.isLoggedIn = false;
    this.customerId = '';
    this.password = '';
    this.error = '';
    
    this.dispatchEvent(new CustomEvent('logout', {
      bubbles: true,
      composed: true
    }));
  }

  private handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.login();
    }
  }

  render() {
    if (this.isLoggedIn) {
      return html`
        <div class="login-container">
          <h2>ログイン済み</h2>
          <div class="logged-in-info">
            顧客ID: ${this.customerId} でログイン中
          </div>
          <yaboo-button variant="solid" size="large" @yaboo-button-click=${this.logout}>
            ログアウト
          </yaboo-button>
        </div>
      `;
    }

    return html`
      <div class="login-container">
        <h2>ログイン</h2>
        
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
        
        <div class="form-group">
          <label for="customerId">顧客ID</label>
          <input
            id="customerId"
            type="text"
            .value=${this.customerId}
            @input=${(e: Event) => this.customerId = (e.target as HTMLInputElement).value}
            @keypress=${this.handleKeyPress}
            placeholder="例: D1000163"
            ?disabled=${this.loading}
          />
        </div>
        
        <div class="form-group">
          <label for="password">パスワード</label>
          <input
            id="password"
            type="password"
            .value=${this.password}
            @input=${(e: Event) => this.password = (e.target as HTMLInputElement).value}
            @keypress=${this.handleKeyPress}
            placeholder="パスワードを入力"
            ?disabled=${this.loading}
          />
        </div>
        
        <yaboo-button 
          variant="solid" 
          size="large" 
          ?disabled=${this.loading}
          @yaboo-button-click=${this.login}
          style="width: 100%;"
        >
          ${this.loading ? 'ログイン中...' : 'ログイン'}
        </yaboo-button>
        
        <div class="demo-accounts">
          <h4>テストアカウント（デモ用）</h4>
          <p>顧客ID: D1000163, パスワード: password</p>
          <p>顧客ID: B1000289, パスワード: password</p>
          <p>※全ての顧客のパスワードは "password" です</p>
        </div>
      </div>
    `;
  }
}