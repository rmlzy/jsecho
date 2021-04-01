import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { User } from '../../entities';
import {
  generateHashedPassword,
  isXss,
  getTimestamp,
  removeEmptyColumns,
  paginateToRes,
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

  async paginate(options) {
    const { pageIndex, pageSize } = options;
    const rows = await paginate(this.userRepo, {
      page: pageIndex,
      limit: pageSize,
    });
    return paginateToRes(rows);
  }

  async findByUid(uid: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { uid } });
    return user;
  }

  findByNameOrMail(input: string) {
    return this.userRepo.findOne({
      where: [{ name: input }, { mail: input }],
    });
  }

  async findByToken(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepo.findOne({
      where: { authCode: token },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
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
