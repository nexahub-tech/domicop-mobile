import { usePaystack } from 'react-native-paystack-webview';
import { mockUser } from '@/data/mockData';

export interface PaymentParams {
  amount: number;
  email?: string;
  reference?: string;
  metadata?: Record<string, any>;
  onSuccess?: (response: any) => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
}

export const usePaystackPayment = () => {
  const { popup } = usePaystack();

  const generateReference = (type: 'contribution' | 'loan' = 'contribution') => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `DOMI-${type.toUpperCase()}-${mockUser.memberId}-${timestamp}-${random}`;
  };

  const initiateContributionPayment = (params: PaymentParams) => {
    const reference = params.reference || generateReference('contribution');
    const email = params.email || mockUser.email;

    popup.checkout({
      email,
      amount: params.amount,
      reference,
      metadata: {
        ...params.metadata,
        custom_fields: [
          {
            display_name: 'Member Name',
            variable_name: 'member_name',
            value: mockUser.name,
          },
          {
            display_name: 'Member ID',
            variable_name: 'member_id',
            value: mockUser.memberId,
          },
          {
            display_name: 'Transaction Type',
            variable_name: 'transaction_type',
            value: 'Savings Contribution',
          },
          ...(params.metadata?.custom_fields || []),
        ],
      },
      onSuccess: (response) => {
        console.log('Payment Success:', response);
        params.onSuccess?.(response);
      },
      onCancel: () => {
        console.log('Payment Cancelled');
        params.onCancel?.();
      },
      onError: (error) => {
        console.error('Payment Error:', error);
        params.onError?.(error);
      },
    });
  };

  const initiateLoanPayment = (params: PaymentParams & { loanId?: string }) => {
    const reference = params.reference || generateReference('loan');
    const email = params.email || mockUser.email;

    popup.checkout({
      email,
      amount: params.amount,
      reference,
      metadata: {
        ...params.metadata,
        custom_fields: [
          {
            display_name: 'Member Name',
            variable_name: 'member_name',
            value: mockUser.name,
          },
          {
            display_name: 'Member ID',
            variable_name: 'member_id',
            value: mockUser.memberId,
          },
          {
            display_name: 'Transaction Type',
            variable_name: 'transaction_type',
            value: 'Loan Repayment',
          },
          {
            display_name: 'Loan ID',
            variable_name: 'loan_id',
            value: params.loanId || 'N/A',
          },
          ...(params.metadata?.custom_fields || []),
        ],
      },
      onSuccess: (response) => {
        console.log('Payment Success:', response);
        params.onSuccess?.(response);
      },
      onCancel: () => {
        console.log('Payment Cancelled');
        params.onCancel?.();
      },
      onError: (error) => {
        console.error('Payment Error:', error);
        params.onError?.(error);
      },
    });
  };

  return {
    initiateContributionPayment,
    initiateLoanPayment,
    generateReference,
  };
};

export default usePaystackPayment;
