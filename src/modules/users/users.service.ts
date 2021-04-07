import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { keyBy } from 'lodash';
import { BaseService } from '../../base';
import { isNotXss, generateHashedPassword } from '../../utils';
import { UpdateProfileDto } from '../public/public-api/dto/update-profile.dto';
import { UpdatePasswordDto } from '../public/public-api/dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapVo } from './vo/create-user.vo';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService extends BaseService<UserEntity> {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {
    super(userRepo);
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const { name, mail, password } = createUserDto;
    this.asset(isNotXss(name), '请不要在用户名中使用特殊字符');
    await this.ensureNotExist({ name }, '用户名已经存在');
    await this.ensureNotExist({ mail }, '电子邮箱地址已经存在');
    await this.userRepo.save({
      name,
      mail,
      screenName: name,
      password: await generateHashedPassword(password),
      created: this.getTimestamp(),
      group: 'subscriber',
    });
    return null;
  }

  async paginate({ pageIndex, pageSize }) {
    const [users, total] = await this.userRepo.findAndCount({
      order: { uid: 'DESC' },
      take: pageSize,
      skip: (pageIndex - 1) * pageSize,
    });
    return {
      items: users,
      total,
      pageIndex,
      pageSize,
    };
  }

  async findByUid(uid: number): Promise<UserEntity> {
    const user = await this.ensureExist({ uid }, '用户不存在');
    return user;
  }

  async findUserMap(): Promise<UserMapVo> {
    const users = await this.userRepo.find({
      select: ['uid', 'screenName'],
    });
    return keyBy(users, 'uid');
  }

  async findScreenNameByUid(uid: number) {
    const user = await this.userRepo.findOne({ where: { uid }, select: ['uid', 'screenName'] });
    return user?.screenName;
  }

  async findLoginInfoByAccount(nameOrMail: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      where: [{ name: nameOrMail }, { mail: nameOrMail }],
      select: ['uid', 'group', 'password'],
    });
    return user;
  }

  async findByToken(token: string): Promise<UserEntity> {
    if (!token) {
      throw new HttpException('未检测到认证信息', 401);
    }
    const user = await this.ensureExist({ authCode: token }, '用户不存在');
    return user;
  }

  async update(uid: number, dto: UpdateUserDto): Promise<void> {
    const { screenName, mail } = dto;
    await this.ensureExist({ uid }, '用户不存在');
    await this.ensureNotExist({ screenName, uid: Not(uid) }, '昵称已经存在');
    await this.ensureNotExist({ mail, uid: Not(uid) }, '电子邮箱地址已经存在');
    dto.password = await generateHashedPassword(dto.password);
    dto.authCode = '';
    await this.userRepo.update({ uid }, dto);
    return null;
  }

  async updateProfile(uid: number, dto: UpdateProfileDto): Promise<void> {
    const { screenName, mail, url } = dto;
    await this.ensureExist({ uid }, '用户不存在');
    await this.ensureNotExist({ screenName, uid: Not(uid) }, '昵称已经存在');
    await this.ensureNotExist({ mail, uid: Not(uid) }, '电子邮箱地址已经存在');
    await this.userRepo.update({ uid }, { screenName, mail, url });
    return null;
  }

  async updatePassword(uid: number, dto: UpdatePasswordDto): Promise<void> {
    const { password } = dto;
    await this.ensureExist({ uid }, '用户不存在');
    const hashedPassword = await generateHashedPassword(password);
    await this.userRepo.update({ uid }, { password: hashedPassword, authCode: '' });
    return null;
  }

  async remove(uid: number): Promise<void> {
    await this.ensureExist({ uid }, '用户不存在');
    await this.userRepo.delete({ uid });
    return null;
  }

  async removeToken(uid): Promise<void> {
    await this.ensureExist({ uid }, '用户不存在');
    await this.userRepo.update({ uid }, { authCode: '' });
  }

  async setToken(uid: number, token: string): Promise<void> {
    await this.ensureExist({ uid }, '用户不存在');
    await this.userRepo.update({ uid }, { authCode: token, logged: this.getTimestamp() });
  }
}
