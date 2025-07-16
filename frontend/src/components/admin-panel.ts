import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Order, Customer } from '../types/api.js';
import { apiService } from '../services/api.js';

@customElement('admin-panel')
export class AdminPanel extends LitElement {
  @state() private orders: Order[] = [];
  @state() private customers: Customer[] = [];
  @state() private loading = false;
  @state() private error = '';
  @state() private activeTab = 'orders';

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
    }

    .tabs {
      display: flex;
      border-bottom: 2px solid #e9ecef;
      margin-bottom: 2rem;
    }

    .tab {
      padding: 1rem 2rem;
      background: none;
      border: none;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s;
      font-size: 1rem;
    }

    .tab:hover {
      background: #f8f9fa;
    }

    .tab.active {
      color: #007bff;
      border-bottom-color: #007bff;
      font-weight: 600;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .data-table th,
    .data-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .data-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }

    .data-table tr:hover {
      background: #f8f9fa;
    }

    .order-no {
      font-family: monospace;
      font-size: 0.9rem;
      color: #666;
    }

    .customer-id {
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

    .area {
      color: #007bff;
    }

    .sex {
      display: inline-block;
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }

    .loading, .error, .no-data {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .error {
      color: #dc3545;
      background: #f8d7da;
      border-radius: 4px;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
    }

    .stat-label {
      color: #666;
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .data-table {
        font-size: 0.8rem;
      }
      
      .data-table th,
      .data-table td {
        padding: 0.5rem;
      }

      .tabs {
        flex-wrap: wrap;
      }

      .tab {
        padding: 0.75rem 1rem;
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  private async loadData() {
    this.loading = true;
    this.error = '';
    
    try {
      const [orders, customers] = await Promise.all([
        apiService.getAllOrders(),
        apiService.getAllCustomers()
      ]);
      
      this.orders = orders;
      this.customers = customers;
    } catch (error) {
      this.error = 'データの読み込みに失敗しました';
      console.error('Failed to load admin data:', error);
    } finally {
      this.loading = false;
    }
  }

  private switchTab(tab: string) {
    this.activeTab = tab;
  }

  private getSexText(sex: number): string {
    return sex === 1 ? '男性' : '女性';
  }

  private getTotalOrderAmount(): number {
    return this.orders.reduce((sum, order) => sum + order.orderPrice, 0);
  }

  private getUniqueCustomerCount(): number {
    const uniqueCustomers = new Set(this.orders.map(order => order.customerId));
    return uniqueCustomers.size;
  }

  render() {
    return html`
      <h2>管理画面</h2>
      
      <div class="stats">
        <div class="stat-card">
          <div class="stat-number">${this.orders.length}</div>
          <div class="stat-label">総注文数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">¥${this.getTotalOrderAmount().toLocaleString()}</div>
          <div class="stat-label">総売上金額</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${this.customers.length}</div>
          <div class="stat-label">登録顧客数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${this.getUniqueCustomerCount()}</div>
          <div class="stat-label">購入顧客数</div>
        </div>
      </div>
      
      <div class="tabs">
        <yaboo-button 
          variant="${this.activeTab === 'orders' ? 'solid' : 'outline'}"
          size="medium"
          @yaboo-button-click=${() => this.switchTab('orders')}
        >
          注文管理
        </yaboo-button>
        <yaboo-button 
          variant="${this.activeTab === 'customers' ? 'solid' : 'outline'}"
          size="medium"
          @yaboo-button-click=${() => this.switchTab('customers')}
        >
          顧客管理
        </yaboo-button>
      </div>
      
      ${this.loading ? html`<div class="loading">読み込み中...</div>` : ''}
      
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      
      ${this.activeTab === 'orders' ? this.renderOrdersTable() : ''}
      ${this.activeTab === 'customers' ? this.renderCustomersTable() : ''}
    `;
  }

  private renderOrdersTable() {
    if (this.loading || this.error) return '';
    
    if (this.orders.length === 0) {
      return html`<div class="no-data">注文データがありません</div>`;
    }

    return html`
      <table class="data-table">
        <thead>
          <tr>
            <th>注文番号</th>
            <th>顧客ID</th>
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
              <td><span class="customer-id">${order.customerId}</span></td>
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
    `;
  }

  private renderCustomersTable() {
    if (this.loading || this.error) return '';
    
    if (this.customers.length === 0) {
      return html`<div class="no-data">顧客データがありません</div>`;
    }

    return html`
      <table class="data-table">
        <thead>
          <tr>
            <th>顧客ID</th>
            <th>氏名</th>
            <th>地域</th>
            <th>年齢</th>
            <th>性別</th>
            <th>生年月日</th>
            <th>累計購入金額</th>
            <th>最終注文日</th>
          </tr>
        </thead>
        <tbody>
          ${this.customers.map(customer => html`
            <tr>
              <td><span class="customer-id">${customer.customerId}</span></td>
              <td>${customer.lastName} ${customer.firstName}</td>
              <td><span class="area">${customer.area}</span></td>
              <td>${customer.age}歳</td>
              <td><span class="sex">${this.getSexText(customer.sex)}</span></td>
              <td><span class="date">${customer.birthday}</span></td>
              <td><span class="price">¥${customer.totalPrice.toLocaleString()}</span></td>
              <td><span class="date">${customer.lastOrderDate}</span></td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }
}