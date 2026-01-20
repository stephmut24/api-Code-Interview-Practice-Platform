import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Problem } from '@/modules/problems/entities/problem.entity';

@Entity()
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Problem, (problem) => problem.id, { onDelete: 'CASCADE' })
  problem: Problem;

  @Column('text')
  input: string;

  @Column('text')
  expectedOutput: string;

  @Column({ default: false })
  isHidden: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
