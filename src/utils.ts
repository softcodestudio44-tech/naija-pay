export const formatAmount = (amount: number): string => {
  return `₦${(amount / 100).toLocaleString()}`;
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack'));
    document.body.appendChild(script);
  });
};

declare global {
  interface Window {
    PaystackPop: any;
  }
}