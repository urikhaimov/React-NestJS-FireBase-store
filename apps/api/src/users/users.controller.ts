// src/users/users.controller.ts
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(FirebaseAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ GET /users/me
  @Get('me')
  async getMe(@Req() req) {
    return this.usersService.getById(req.user.uid);
  }

  // ✅ PATCH /users/me
  @Patch('me')
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.uid, dto);
  }

  // ✅ GET /users — admin only
  @UseGuards(RolesGuard)
  @Roles('admin', 'superadmin')
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // ✅ PATCH /users/:id/role — admin only
  @UseGuards(RolesGuard)
  @Roles('admin', 'superadmin')
  @Patch(':id/role')
  async setRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.setRole(id, role as any);
  }

  // ✅ DELETE /users/:id — admin only
  @UseGuards(RolesGuard)
  @Roles('admin', 'superadmin')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
