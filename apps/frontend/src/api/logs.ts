import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export interface LogEntry {
  id: string;
  action: string;
  categoryId?: string;
  adminId: string;
  timestamp: { seconds: number; nanoseconds: number };
}

export async function fetchLogs(): Promise<LogEntry[]> {
  const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<LogEntry, 'id'>),
  }));
}
export async function fetchLogsByCategory(categoryId: string): Promise<LogEntry[]> {
  const q = query(
    collection(db, 'logs'),
    orderBy('timestamp', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<LogEntry, 'id'>),
    }))
    .filter(log => log.categoryId === categoryId);
}