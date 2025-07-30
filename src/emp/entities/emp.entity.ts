import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Emp {
  // 自增主键
  @PrimaryGeneratedColumn()
  id: number;

  // 索引
  @Generated('uuid')
  @Index()
  uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ select: false })
  password: string;

  // 0 as female, 1 as male, 2 as unknown
  @Column({
    type: 'enum',
    enum: [0, 1, 2],
    default: 2,
    comment: '0 as female, 1 as male, 2 as unknown',
  })
  gender: number;

  @Column('simple-array')
  // 使用 roles.join(',') 持久化到数据库
  roles: string[];

  @Column('simple-json')
  // 使用 JSON.stringify(user) 持久化到数据库
  userInfo: { name: string; age: number };

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;
}
