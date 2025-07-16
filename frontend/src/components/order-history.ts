import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Order } from '../types/api.js';
import { apiService } from '../services/api.js';

@customElement('order-history')
export class OrderHistory extends LitElement {
  @state() private orders: Order[] = [];
  @state() private loading = false;
  @state() private error = '';

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .orders-table th,
    .orders-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .orders-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }

    .orders-table tr:hover {
      background: #f8f9fa;
    }

    .order-no {
      font-family: monospace;
      font-size: 0.9rem;
      color: #666;
    }

    .item-category {
      display: inline-block;
      background: #e9ecef;
      color: #495057;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }

    .price {
      font-weight: bold;
      color: #28a745;
    }

    .date {
      color: #666;
    }

    .loading, .error, .no-orders {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .error {
      color: #dc3545;
      background: #f8d7da;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .orders-table {
        font-size: 0.9rem;
      }
      
      .orders-table th,
      .orders-table td {
        padding: 0.5rem;
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadOrders();
  }

  private async loadOrders() {
    this.loading = true;
    this.error = '';
    
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      this.error = 'ログインが必要です';
      this.loading = false;
      return;
    }
    
    try {
      this.orders = await apiService.getOrdersByCustomer(customerId);
    } catch (error) {
      this.error = 'データの読み込みに失敗しました';
      console.error('Failed to load orders:', error);
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <h2>注文履歴</h2>
      
      ${this.loading ? html`<div class="loading">読み込み中...</div>` : ''}
      
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      
      ${!this.loading && !this.error && this.orders.length === 0 ? 
        html`<div class="no-orders">注文履歴がありません</div>` : ''
      }
      
      ${!this.loading && !this.error && this.orders.length > 0 ? html`
        <table class="orders-table">
          <thead>
            <tr>
              <th>注文番号</th>
              <th>注文日</th>
              <th>商品コード</th>
              <th>カテゴリ</th>
              <th>単価</th>
              <th>数量</th>
              <th>合計金額</th>
            </tr>
          </thead>
          <tbody>
            ${this.orders.map(order => html`
              <tr>
                <td><span class="order-no">${order.orderNo}</span></td>
                <td><span class="date">${order.orderDate}</span></td>
                <td>${order.orderItem}</td>
                <td><span class="item-category">${order.orderItemCategory}</span></td>
                <td><span class="price">¥${order.itemPrice.toLocaleString()}</span></td>
                <td>${order.orderNum}</td>
                <td><span class="price">¥${order.orderPrice.toLocaleString()}</span></td>
              </tr>
            `)}
          </tbody>
        </table>
      ` : ''}
    `;
  }
}