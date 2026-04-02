export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  type: 'contribution' | 'payment' | 'loan';
  amount: number;
  date: Date;
}

export interface Loan {
  id: string;
  amount: number;
  purpose: string;
  term: number;
  interestRate: number;
}
