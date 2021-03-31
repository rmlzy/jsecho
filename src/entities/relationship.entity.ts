import { Column, Entity } from 'typeorm';

@Entity({
  name: 'pp_relationships',
})
export class Relationship {
  @Column({ unsigned: true, primary: true })
  mid: number;

  @Column({ unsigned: true, primary: true })
  cid: number;
}
