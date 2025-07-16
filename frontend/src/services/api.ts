import { Item, Order, Customer, OrderRequest } from '../types/api.js';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getItems(): Promise<Item[]> {
    return this.request<Item[]>('/items');
  }

  async searchItems(category?: string, itemCode?: string): Promise<Item[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (itemCode) params.append('itemCode', itemCode);
    
    const query = params.toString();
    return this.request<Item[]>(`/items/search${query ? `?${query}` : ''}`);
  }

  async getItem(itemCode: string): Promise<Item> {
    return this.request<Item>(`/items/${itemCode}`);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.request<Order[]>('/orders');
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.request<Order[]>(`/orders/customer/${customerId}`);
  }

  async createOrder(orderRequest: OrderRequest): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderRequest),
    });
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.request<Customer[]>('/customers');
  }

  async getCustomer(customerId: string): Promise<Customer> {
    return this.request<Customer>(`/customers/${customerId}`);
  }
}

export const apiService = new ApiService();