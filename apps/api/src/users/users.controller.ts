import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Param,
  Body,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { adminDb, admin } from '../firebase/firebase-admin';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  // GET /users
  @Get()
  async findAll() {
    const snapshot = await adminDb.collection('users').get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // GET /users/:id
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const docRef = adminDb.collection('users').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) throw new NotFoundException('User not found');
    return snap.data();
  }

  // PUT /users/:id
@Put(':id')
async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
  try {
    console.log('Updating user:', id, body); // 🟩 Add this

    const docRef = adminDb.collection('users').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) throw new NotFoundException('User not found');

    const updateData: Partial<UpdateUserDto> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.photoURL !== undefined) updateData.photoURL = body.photoURL;

    await docRef.update(updateData);
    return { success: true };
  } catch (error) {
    console.error('🔥 Update error:', error); // 🟥 This is key
    throw new InternalServerErrorException('Failed to update user profile');
  }
}
  // DELETE /users/:id/avatar
  @Delete(':id/avatar')
  async deleteAvatar(@Param('id') id: string) {
    const avatarPath = `avatars/${id}`;
    const bucket = admin.storage().bucket();

    try {
      await bucket.file(avatarPath).delete();
      await adminDb.collection('users').doc(id).update({ photoURL: null });
      return { success: true };
    } catch (error) {
      console.error('🔥 Error deleting avatar:', error.message);
      throw new NotFoundException('Avatar not found or already deleted');
    }
  }

  // POST /users/:id/avatar
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ): Promise<{ photoURL: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const avatarPath = `avatars/${id}`;
      const bucket = admin.storage().bucket();
      const fileRef = bucket.file(avatarPath);

      await fileRef.save(file.buffer, {
        contentType: file.mimetype,
        public: true,
        metadata: {
          cacheControl: 'public,max-age=31536000',
        },
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${avatarPath}`;

      await adminDb.collection('users').doc(id).update({
        photoURL: publicUrl,
      });

      return { photoURL: publicUrl };
    } catch (error) {
      console.error('🔥 Upload error:', error.message);
      throw new InternalServerErrorException('Failed to upload avatar');
    }
  }
}
