import { Node } from 'src/common/node.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends Node {
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'int', default: 0 })
  age: number;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', default: '' })
  profileImage: string;
}
