import React, { useState, useCallback } from 'react';
import { NaijaPayProps, PaystackResponse } from './types';
import { formatAmount, validateEmail, loadPaystackScript } from './utils';

export const NaijaPay: React.FC<NaijaPayProps> = ({
  amount,
  email,
  publicKey,
  currency = 'NGN',
  metadata = {},
  onSuccess,
  onClose,
  buttonText = 'Pay Now',
  buttonClassName = '',
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = useCallback(async () => {
    if (!amount || amount < 100) {
      setError('Amount must be at least ₦1 (100 kobo)');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!publicKey) {
      setError('Paystack public key is required');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await loadPaystackScript();

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount,
        currency,
        ref: `naija_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: 'Platform',
              variable_name: 'platform',
              value: 'NaijaPay',
            },
          ],
        },
        callback: (response: PaystackResponse) => {
          setIsLoading(false);
          if (response.status === 'success') {
            onSuccess?.(response.reference);
          }
        },
        onClose: () => {
          setIsLoading(false);
          onClose?.();
        },
      });

      handler.openIframe();
    } catch (err) {
      setIsLoading(false);
      setError('Failed to initialize payment. Please try again.');
      console.error('NaijaPay Error:', err);
    }
  }, [amount, email, publicKey, currency, metadata, onSuccess, onClose]);

  const baseStyles: React.CSSProperties = {
    padding: '12px 24px',
    backgroundColor: disabled || isLoading ? '#ccc' : '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    width: '100%',
    maxWidth: '300px',
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={handlePayment}
        disabled={disabled || isLoading}
        className={buttonClassName}
        style={baseStyles}
      >
        {isLoading ? 'Processing...' : `${buttonText} ${formatAmount(amount)}`}
      </button>
      
      {error && (
        <p style={{ 
          color: '#EF4444', 
          fontSize: '14px', 
          marginTop: '8px',
          marginBottom: 0 
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export { formatAmount, validateEmail } from './utils';
export type { NaijaPayProps, PaystackResponse } from './types';

export default NaijaPay;