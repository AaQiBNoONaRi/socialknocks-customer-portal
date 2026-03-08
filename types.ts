
export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  OWNER = 'Owner',
  ADMIN = 'Admin',
  MEMBER = 'Member',
  DESIGNER = 'Designer',
  CLIENT = 'Client',
  GUEST = 'Guest'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  email: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  initials: string;
  color: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  icon: any; // Lucide icon component
  path: string;
  allowedRoles: UserRole[];
  badge?: string;
}

export interface DesignRequest {
  id: string;
  title: string;
  type: 'Graphic' | 'Social' | 'Web' | 'Store';
  status: 'Pending' | 'In Progress' | 'Review' | 'Approved';
  priority: 'Low' | 'Medium' | 'High';
  date: string;
  assignedTo?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  sales?: number;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'Instagram' | 'LinkedIn' | 'Twitter' | 'TikTok' | 'Meta Ads' | 'Google Ads';
  status: 'Draft' | 'Active' | 'Completed';
  reach: number;
  budget?: number;
  spent?: number;
  startDate?: string;
  objective?: 'Sales' | 'Awareness' | 'Engagement';
  roi?: number;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  email: string;
  status: 'Active' | 'Inactive';
  logo: string;
}

export interface SocialProfile {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'LinkedIn' | 'Twitter' | 'TikTok' | 'YouTube';
  username: string;
  avatar: string;
  followers: number;
  status: 'Connected' | 'Disconnected' | 'Token Expired';
  lastSync: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  date: string;
  read: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'post' | 'campaign' | 'task';
  platform?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Billing' | 'Technical' | 'Feature Request' | 'Account' | 'Other';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  message: string;
  date: string;
  lastUpdate: string;
}
