"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.formatAmount = exports.NaijaPay = void 0;
const react_1 = __importStar(require("react"));
const utils_1 = require("./utils");
const NaijaPay = ({ amount, email, publicKey, currency = 'NGN', metadata = {}, onSuccess, onClose, buttonText = 'Pay Now', buttonClassName = '', disabled = false, }) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const handlePayment = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!amount || amount < 100) {
            setError('Amount must be at least ₦1 (100 kobo)');
            return;
        }
        if (!(0, utils_1.validateEmail)(email)) {
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
            yield (0, utils_1.loadPaystackScript)();
            const handler = window.PaystackPop.setup({
                key: publicKey,
                email,
                amount,
                currency,
                ref: `naija_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
                metadata: Object.assign(Object.assign({}, metadata), { custom_fields: [
                        {
                            display_name: 'Platform',
                            variable_name: 'platform',
                            value: 'NaijaPay',
                        },
                    ] }),
                callback: (response) => {
                    setIsLoading(false);
                    if (response.status === 'success') {
                        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(response.reference);
                    }
                },
                onClose: () => {
                    setIsLoading(false);
                    onClose === null || onClose === void 0 ? void 0 : onClose();
                },
            });
            handler.openIframe();
        }
        catch (err) {
            setIsLoading(false);
            setError('Failed to initialize payment. Please try again.');
            console.error('NaijaPay Error:', err);
        }
    }), [amount, email, publicKey, currency, metadata, onSuccess, onClose]);
    const baseStyles = {
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
    return (react_1.default.createElement("div", { style: { fontFamily: 'system-ui, sans-serif' } },
        react_1.default.createElement("button", { onClick: handlePayment, disabled: disabled || isLoading, className: buttonClassName, style: baseStyles }, isLoading ? 'Processing...' : `${buttonText} ${(0, utils_1.formatAmount)(amount)}`),
        error && (react_1.default.createElement("p", { style: {
                color: '#EF4444',
                fontSize: '14px',
                marginTop: '8px',
                marginBottom: 0
            } }, error))));
};
exports.NaijaPay = NaijaPay;
var utils_2 = require("./utils");
Object.defineProperty(exports, "formatAmount", { enumerable: true, get: function () { return utils_2.formatAmount; } });
Object.defineProperty(exports, "validateEmail", { enumerable: true, get: function () { return utils_2.validateEmail; } });
exports.default = exports.NaijaPay;
