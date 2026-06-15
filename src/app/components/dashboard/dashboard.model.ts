export interface DashboardDto {
  pending: number;
  accountValidated: number;
  accountNotFound: number;
  freezeApplied: number;
  balanceProvided: number;
  lastRunTime: string | null;
  duration: string;
  freezeOrders: number;
  balanceOrders: number;
}

export interface BatchRunResponse {
  success: boolean;
  message: string;
}
