import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'pp_users',
})
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  uid: number;

  @Column({ length: 32, default: '' })
  name: string;

  @Column({ length: 64, default: '' })
  password: string;

  @Column({ length: 200, default: '' })
  mail: string;

  @Column({ length: 200, default: '' })
  url: string;

  @Column({ length: 32, default: '' })
  screenName: string;

  @Column({ unsigned: true, default: 0 })
  created: number;

  @Column({ unsigned: true, default: 0 })
  activated: number;

  @Column({ unsigned: true, default: 0 })
  logged: number;

  @Column({ length: 255, default: 'visitor' })
  group: string;

  @Column({ length: 500, default: '' })
  authCode: string;
}
