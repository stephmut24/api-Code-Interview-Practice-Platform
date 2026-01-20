import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  difficulty: string;

  @Column('text')
  constraints: string;

  @Column({ default: 1000 })
  timeLimit: number; // en millisecondes

  @Column({ default: 256 })
  memoryLimit: number; // en MB

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
