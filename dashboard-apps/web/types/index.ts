// Domain models
export interface Claim {
  id: string;
  member: string;
  date: string;
  provider: string;
  status: string;
  amount: string;
  color?: string;
}

export interface PlanInfo {
  plan: string;
  memberId: string;
  groupId: string;
  effective: string;
  status: string;
}

export interface CoveredMember {
  name: string;
  rel: string;
}

export interface MemberOption {
  label: string;
  value: string;
}

export interface AccumulatorItem {
  label: string;
  spent: number;
  total: number;
  color: string;
}

export interface AccumulatorData {
  inNetwork: AccumulatorItem[];
  outNetwork: AccumulatorItem[];
}

export interface PcpInfo {
  doc: string;
  spec: string;
  phone: string;
  addr: string;
}

export interface Benefit {
  service: string;
  payorPays?: number;
  youPay?: number;
  isFixed?: boolean;
  fixedText?: string;
}

export interface Provider {
  id: number;
  name: string;
  specialty: string;
  facility: string;
  city: string;
  rating: number;
  reviews: number;
  address: string;
  distance: string;
  phone: string;
  photo: string;
}

export interface SearchCategory {
  id: string;
  label: string;
  icon: string;
}

export interface SaveStatus {
  ok: boolean;
  message: string;
}

export interface DashboardData {
  planInfo: PlanInfo;
  coveredMembers: CoveredMember[];
  hraBalance: string;
  recentClaims: Claim[];
  dashboardTabs: string[];
  memberOptions: MemberOption[];
  loading: boolean;
}
