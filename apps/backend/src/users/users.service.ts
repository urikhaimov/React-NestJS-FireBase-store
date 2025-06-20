// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { adminDb, adminAuth } from '../firebase/firebase-admin';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    private collection = adminDb.collection('users');

    async getById(uid: string) {
        const doc = await this.collection.doc(uid).get();
        if (!doc.exists) throw new NotFoundException('User not found');
        return { id: doc.id, ...doc.data() };
    }

    async update(uid: string, data: UpdateUserDto) {
        // Convert to plain object (if needed)
        const updateData = { ...data };

        await this.collection.doc(uid).update(updateData);
        return { uid, ...updateData };
    }

    async getAllUsers() {
        const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async delete(uid: string) {
        await adminAuth.deleteUser(uid);
        await this.collection.doc(uid).delete();
        return { uid };
    }

    async setRole(uid: string, role: 'user' | 'admin' | 'superadmin') {
        await adminAuth.setCustomUserClaims(uid, { role });
        await this.collection.doc(uid).update({ role });
        return { uid, role };
    }
}
