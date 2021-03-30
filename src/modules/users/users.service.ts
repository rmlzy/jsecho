import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  generateHashedPassword,
  isXss,
  getTimestamp,
  removeEmptyColumns,
} from '../../utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { name, mail, password } = createUserDto;
    if (isXss(name)) {
      throw new HttpException('请不要在用户名中使用特殊字符', 409);
    }
    const nameExisted = await this.userRepo.findOne({ where: { name } });
    if (nameExisted) {
      throw new HttpException('用户名已经存在', 409);
    }
    const mailExisted = await this.userRepo.findOne({ where: { mail } });
    if (mailExisted) {
      throw new HttpException('电子邮箱地址已经存在', 409);
    }
    const hashedPassword = await generateHashedPassword(password);
    const created = await this.userRepo.save({
      name,
      mail,
      screenName: name,
      password: hashedPassword,
      created: getTimestamp(),
      group: 'subscriber',
    });
    return null;
  }

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  findOne(uid: number): Promise<User> {
    return this.userRepo.findOne({ where: { uid } });
  }

  findByNameOrMail(input: string) {
    return this.userRepo.findOne({
      where: [{ name: input }, { mail: input }],
    });
  }

  findByToken(token: string) {
    return this.userRepo.findOne({
      where: { authCode: token },
    });
  }

  async update(uid: number, columns) {
    await this.userRepo.update({ uid }, removeEmptyColumns(columns));
  }

  async updateProfile(
    uid: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<void> {
    const { screenName, mail, url } = updateProfileDto;
    const screenNameExisted = await this.userRepo.findOne({
      where: { screenName },
    });
    if (screenNameExisted) {
      throw new HttpException('昵称已经存在', 409);
    }
    const mailExisted = await this.userRepo.findOne({ where: { mail } });
    if (mailExisted) {
      throw new HttpException('电子邮箱地址已经存在', 409);
    }
    await this.update(uid, { screenName, mail, url });
    return null;
  }

  async updatePassword(
    uid: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const { password, confirm } = updatePasswordDto;
    if (password !== confirm) {
      throw new HttpException('两次输入的密码不一致', 409);
    }
    const hashedPassword = await generateHashedPassword(password);
    await this.update(uid, { password: hashedPassword });
    return null;
  }

  async remove(uid: number): Promise<void> {
    const existed = await this.userRepo.findOne({ uid });
    if (!existed) {
      throw new HttpException('资源不存在', 404);
    }
    // TODO: 校验当前用户权限
    const removed = await this.userRepo.delete({ uid });
    return null;
  }

  async removeToken(uid) {
    await this.userRepo.update({ uid }, { authCode: '' });
  }
}
