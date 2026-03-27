"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPaystackScript = exports.validateEmail = exports.formatAmount = void 0;
const formatAmount = (amount) => {
    return `₦${(amount / 100).toLocaleString()}`;
};
exports.formatAmount = formatAmount;
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
exports.validateEmail = validateEmail;
const loadPaystackScript = () => {
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
exports.loadPaystackScript = loadPaystackScript;
