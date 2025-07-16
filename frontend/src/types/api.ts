export interface Item {
  item: string;
  itemCategory: string;
  itemPrice: number;
  stock: number;
}

export interface Order {
  orderNo: string;
  customerId: string;
  orderDate: string;
  itemPrice: number;
  orderItem: string;
  orderItemCategory: string;
  orderNum: number;
  orderPrice: number;
}

export interface Customer {
  customerId: string;
  lastName: string;
  firstName: string;
  areaCode: string;
  area: string;
  birthday: string;
  age: number;
  sex: number;
  totalPrice: number;
  lastOrderDate: string;
  password: string;
}

export interface OrderRequest {
  customerId: string;
  itemCode: string;
  quantity: number;
}