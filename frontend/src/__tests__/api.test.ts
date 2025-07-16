import { apiService } from '../services/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getItems', () => {
    it('should fetch all items successfully', async () => {
      const mockItems = [
        { item: 'ax10002', itemCategory: '家具', itemPrice: 23700, stock: 13 },
        { item: 'gr10003', itemCategory: '家電', itemPrice: 28200, stock: 146 }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockItems,
      });

      const result = await apiService.getItems();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/items',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockItems);
    });

    it('should throw error when fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(apiService.getItems()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('searchItems', () => {
    it('should search items with category parameter', async () => {
      const mockItems = [
        { item: 'gr10003', itemCategory: '家電', itemPrice: 28200, stock: 146 }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockItems,
      });

      const result = await apiService.searchItems('家電');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/items/search?category=%E5%AE%B6%E9%9B%BB',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockItems);
    });
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const orderRequest = {
        customerId: 'D1000163',
        itemCode: 'ax10002',
        quantity: 1
      };

      const mockOrder = {
        orderNo: '20241220-000001',
        customerId: 'D1000163',
        orderDate: '2024-12-20',
        itemPrice: 23700,
        orderItem: 'ax10002',
        orderItemCategory: '家具',
        orderNum: 1,
        orderPrice: 23700
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrder,
      });

      const result = await apiService.createOrder(orderRequest);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/orders',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderRequest),
        })
      );
      expect(result).toEqual(mockOrder);
    });
  });
});