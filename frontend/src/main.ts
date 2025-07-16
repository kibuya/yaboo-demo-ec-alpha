import './components/item-list.js';
import './components/order-history.js';
import './components/login-form.js';
import './components/admin-panel.js';
import './components/yaboo-button.js';

class App {
  private mainElement: HTMLElement;
  private currentView = 'items';

  constructor() {
    this.mainElement = document.getElementById('main')!;
    this.initializeNavigation();
    this.initializeEventListeners();
    this.showItemList();
  }

  private initializeNavigation() {
    const loginBtn = document.getElementById('loginBtn')!;
    const itemsBtn = document.getElementById('itemsBtn')!;
    const ordersBtn = document.getElementById('ordersBtn')!;
    const adminBtn = document.getElementById('adminBtn')!;

    loginBtn.addEventListener('yaboo-button-click', () => this.showLogin());
    itemsBtn.addEventListener('yaboo-button-click', () => this.showItemList());
    ordersBtn.addEventListener('yaboo-button-click', () => this.showOrderHistory());
    adminBtn.addEventListener('yaboo-button-click', () => this.showAdminPanel());
  }

  private initializeEventListeners() {
    document.addEventListener('login-success', () => {
      this.showItemList();
      this.updateNavigationState();
    });

    document.addEventListener('logout', () => {
      this.showLogin();
      this.updateNavigationState();
    });
  }

  private updateNavigationState() {
    const isLoggedIn = !!localStorage.getItem('customerId');
    const loginBtn = document.getElementById('loginBtn')! as any;
    const ordersBtn = document.getElementById('ordersBtn')! as any;

    loginBtn.textContent = isLoggedIn ? 'ログアウト' : 'ログイン';
    ordersBtn.disabled = !isLoggedIn;

    if (!isLoggedIn && this.currentView === 'orders') {
      this.showLogin();
    }
  }

  private showLogin() {
    this.currentView = 'login';
    this.mainElement.innerHTML = '<login-form></login-form>';
    this.updateActiveNavButton('loginBtn');
  }

  private showItemList() {
    this.currentView = 'items';
    this.mainElement.innerHTML = '<item-list></item-list>';
    this.updateActiveNavButton('itemsBtn');
  }

  private showOrderHistory() {
    const isLoggedIn = !!localStorage.getItem('customerId');
    if (!isLoggedIn) {
      alert('ログインが必要です');
      this.showLogin();
      return;
    }

    this.currentView = 'orders';
    this.mainElement.innerHTML = '<order-history></order-history>';
    this.updateActiveNavButton('ordersBtn');
  }

  private showAdminPanel() {
    this.currentView = 'admin';
    this.mainElement.innerHTML = '<admin-panel></admin-panel>';
    this.updateActiveNavButton('adminBtn');
  }

  private updateActiveNavButton(activeId: string) {
    const buttons = ['loginBtn', 'itemsBtn', 'ordersBtn', 'adminBtn'];
    buttons.forEach(id => {
      const btn = document.getElementById(id)! as any;
      if (id === activeId) {
        btn.variant = 'solid';
      } else {
        btn.variant = 'outline';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});