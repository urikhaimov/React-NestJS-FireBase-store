// src/theme/theme.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import { ThemeSettings } from './theme.model';

@Injectable()
export class ThemeService {
  private readonly docRef;

  constructor(@Inject('Firestore') private readonly firestore: Firestore) {
    this.docRef = this.firestore.doc('themes/settings');
  }

  async getTheme(): Promise<ThemeSettings | null> {
    const snap = await this.docRef.get();
    return snap.exists ? (snap.data() as ThemeSettings) : null;
  }

  async updateTheme(data: Partial<ThemeSettings>): Promise<void> {
    await this.docRef.set(data, { merge: true });
  }
}
