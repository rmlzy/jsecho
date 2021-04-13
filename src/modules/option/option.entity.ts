import { Column, Entity } from "typeorm";

@Entity({
  name: "pp_options",
})
export class OptionEntity {
  @Column({ length: 32, nullable: false, primary: true })
  name: string;

  @Column({ default: 0, nullable: false, unsigned: true, primary: true })
  user: number;

  @Column({ type: "text" })
  value: string;
}
