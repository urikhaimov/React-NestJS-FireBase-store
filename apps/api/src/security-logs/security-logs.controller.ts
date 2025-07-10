import { Controller, Get } from '@nestjs/common';

export interface SecurityLog {
  id: string;
  timestamp: string; // ISO string
  email?: string;
  uid?: string;
  type: string;
  details: string;
  collection: string;
  affectedDocId: string;
}

// Dummy example data
const dummyLogs: SecurityLog[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    email: 'user@example.com',
    type: 'LOGIN_FAILURE',
    details: 'Failed login attempt from IP 123.45.67.89',
    collection: 'users',
    affectedDocId: 'user_1',
  },
  {
    id: '2',
    timestamp: new Date().toISOString(),
    uid: 'user_2',
    type: 'ORDER_EDIT',
    details: 'Order 12345 status changed to shipped',
    collection: 'orders',
    affectedDocId: 'order_12345',
  },
];

@Controller('admin/security-logs')
export class SecurityLogsController {
  @Get()
  getSecurityLogs(): SecurityLog[] {
    // Replace with real DB fetch in production
    return dummyLogs;
  }
}
