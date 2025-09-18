import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, role: string = 'USER') {
    const hash = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hash, role });
    await user.save();
    return { message: 'User registered successfully', email: user.email, role: user.role };
  }

  async login(email: string, password: string) {
  const user = await this.userModel.findOne({ email });
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new UnauthorizedException('Invalid credentials');

  // ép kiểu _id thành string
  const payload = { sub: user._id.toString(), email: user.email, role: user.role };
  return { access_token: await this.jwt.signAsync(payload) };
}

}
