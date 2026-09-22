export type UserRole = 'SYSTEM_ADMIN' | 'FINANCIAL_MANAGER' | 'DATA_ANALYST' | 'STANDARD_USER';

export interface SystemUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface TransactionPayload {
  transactionId: string;
  merchantId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  timestamp: string;
}

export interface NetworkPacket {
  route: string;
  payload: TransactionPayload;
  signature?: string;
}
