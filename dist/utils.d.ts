export declare const formatAmount: (amount: number) => string;
export declare const validateEmail: (email: string) => boolean;
export declare const loadPaystackScript: () => Promise<void>;
declare global {
    interface Window {
        PaystackPop: any;
    }
}
