import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { UserEntity } from '../../entities';
import { generateHashedPassword, isNotXss, BaseService } from '../../common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {
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

  async paginate(options) {
    const { pageIndex, pageSize } = options;
    const rows = await paginate(this.userRepo, {
      page: pageIndex,
      limit: pageSize,
    });
    return this.parsePaginateRes(rows);
  }

  async findByUid(uid: number): Promise<UserEntity> {
    const user = await this.ensureExist({ uid }, '用户不存在');
    return user;
  }

  async findByNameOrMail(input: string): Promise<UserEntity> {
    const user = await this.ensureExist([{ name: input }, { mail: input }]);
    return user;
  }

  async findByToken(token: string): Promise<UserEntity> {
    this.asset(token, '未检测到认证信息');
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
    const { password, confirm } = dto;
    this.asset(password === confirm, '两次输入的密码不一致');
    await this.ensureExist({ uid }, '用户不存在');
    const hashedPassword = await generateHashedPassword(password);
    await this.userRepo.update(
      { uid },
      { password: hashedPassword, authCode: '' },
    );
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
    await this.userRepo.update(
      { uid },
      { authCode: token, logged: this.getTimestamp() },
    );
  }
}
