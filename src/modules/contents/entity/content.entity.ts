import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'pp_contents',
})
export class ContentEntity {
  @PrimaryGeneratedColumn()
  cid: number;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200 })
  slug: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  created: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  modified: number;

  @Column({ type: 'longtext' })
  text: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  order: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  authorId: number;

  @Column({ length: 32 })
  template: string;

  @Column({ length: 16, default: 'post' })
  type: string;

  @Column({ length: 16, default: 'publish' })
  status: string;

  @Column({ length: 32 })
  password: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  commentsNum: number;

  @Column({ length: 1, default: '0' })
  allowComment: string;

  @Column({ length: 1, default: '0' })
  allowPing: string;

  @Column({ length: 1, default: '0' })
  allowFeed: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  parent: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  views: number;
}
