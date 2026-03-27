export interface NaijaPayProps {
    amount: number;
    email: string;
    publicKey: string;
    currency?: 'NGN' | 'GHS' | 'USD';
    metadata?: Record<string, any>;
    onSuccess?: (reference: string) => void;
    onClose?: () => void;
    buttonText?: string;
    buttonClassName?: string;
    disabled?: boolean;
}
export interface PaystackResponse {
    reference: string;
    status: 'success' | 'failed';
    trans: string;
    transaction: string;
    message: string;
}
