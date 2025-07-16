import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Item } from '../types/api.js';
import { apiService } from '../services/api.js';

@customElement('item-list')
export class ItemList extends LitElement {
  @state() private items: Item[] = [];
  @state() private loading = false;
  @state() private error = '';
  @state() private searchCategory = '';
  @state() private searchItemCode = '';

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
    }

    .search-section {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .search-form {
      display: flex;
      gap: 1rem;
      align-items: end;
      flex-wrap: wrap;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      min-width: 200px;
    }

    label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
    }

    button:hover {
      background: #0056b3;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .item-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1.5rem;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .item-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .item-code {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .item-category {
      display: inline-block;
      background: #e9ecef;
      color: #495057;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }

    .item-price {
      font-size: 1.25rem;
      font-weight: bold;
      color: #28a745;
      margin-bottom: 1rem;
    }

    .stock-info {
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .stock-available {
      color: #28a745;
    }

    .stock-low {
      color: #ffc107;
    }

    .stock-out {
      color: #dc3545;
    }

    .order-button {
      width: 100%;
      padding: 0.75rem;
      background: #28a745;
      margin-top: 1rem;
    }

    .order-button:hover {
      background: #218838;
    }

    .order-button:disabled {
      background: #6c757d;
    }

    .loading, .error, .no-items {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .error {
      color: #dc3545;
      background: #f8d7da;
      border-radius: 4px;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadItems();
  }

  private async loadItems() {
    this.loading = true;
    this.error = '';
    
    try {
      this.items = await apiService.getItems();
    } catch (error) {
      this.error = 'データの読み込みに失敗しました';
      console.error('Failed to load items:', error);
    } finally {
      this.loading = false;
    }
  }

  private async searchItems() {
    this.loading = true;
    this.error = '';
    
    try {
      this.items = await apiService.searchItems(
        this.searchCategory || undefined,
        this.searchItemCode || undefined
      );
    } catch (error) {
      this.error = '検索に失敗しました';
      console.error('Failed to search items:', error);
    } finally {
      this.loading = false;
    }
  }

  private async orderItem(item: Item) {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      alert('ログインが必要です');
      return;
    }

    if (item.stock <= 0) {
      alert('在庫がありません');
      return;
    }

    try {
      await apiService.createOrder({
        customerId,
        itemCode: item.item,
        quantity: 1
      });
      
      alert('注文が完了しました');
      await this.loadItems();
    } catch (error) {
      alert('注文に失敗しました');
      console.error('Failed to create order:', error);
    }
  }

  private getStockClass(stock: number): string {
    if (stock <= 0) return 'stock-out';
    if (stock <= 10) return 'stock-low';
    return 'stock-available';
  }

  private getStockText(stock: number): string {
    if (stock <= 0) return '在庫なし';
    if (stock <= 10) return `残り${stock}個`;
    return `在庫あり（${stock}個）`;
  }

  render() {
    return html`
      <div class="search-section">
        <h2>商品検索</h2>
        <div class="search-form">
          <div class="form-group">
            <label for="category">カテゴリ</label>
            <input
              id="category"
              type="text"
              .value=${this.searchCategory}
              @input=${(e: Event) => this.searchCategory = (e.target as HTMLInputElement).value}
              placeholder="例: 家電"
            />
          </div>
          <div class="form-group">
            <label for="itemCode">商品コード</label>
            <input
              id="itemCode"
              type="text"
              .value=${this.searchItemCode}
              @input=${(e: Event) => this.searchItemCode = (e.target as HTMLInputElement).value}
              placeholder="例: ax10002"
            />
          </div>
          <yaboo-button 
            variant="solid" 
            size="medium" 
            ?disabled=${this.loading}
            @yaboo-button-click=${this.searchItems}
          >
            検索
          </yaboo-button>
          <yaboo-button 
            variant="outline" 
            size="medium" 
            ?disabled=${this.loading}
            @yaboo-button-click=${this.loadItems}
          >
            全件表示
          </yaboo-button>
        </div>
      </div>

      ${this.loading ? html`<div class="loading">読み込み中...</div>` : ''}
      
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      
      ${!this.loading && !this.error && this.items.length === 0 ? 
        html`<div class="no-items">商品が見つかりません</div>` : ''
      }
      
      ${!this.loading && !this.error && this.items.length > 0 ? html`
        <div class="items-grid">
          ${this.items.map(item => html`
            <div class="item-card">
              <div class="item-code">商品コード: ${item.item}</div>
              <div class="item-category">${item.itemCategory}</div>
              <div class="item-price">¥${item.itemPrice.toLocaleString()}</div>
              <div class="stock-info ${this.getStockClass(item.stock)}">
                ${this.getStockText(item.stock)}
              </div>
              <yaboo-button 
                variant="solid"
                size="medium"
                ?disabled=${item.stock <= 0}
                @yaboo-button-click=${() => this.orderItem(item)}
                style="width: 100%;"
              >
                ${item.stock > 0 ? 'ワンクリック注文' : '在庫なし'}
              </yaboo-button>
            </div>
          `)}
        </div>
      ` : ''}
    `;
  }
}