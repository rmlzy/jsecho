import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'pp_metas',
})
export class Meta {
  @PrimaryGeneratedColumn()
  mid: number;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200 })
  slug: string;

  @Column({ length: 32 })
  type: string;

  @Column({ length: 200 })
  description: string;

  @Column({ type: 'int', default: 0 })
  count: number;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'int', default: 0 })
  parent: number;
}
