import { Company } from 'src/form/entities/company.entity';
import { Upload } from 'src/form/entities/upload.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  USER_A = 'userA',
  USER_B = 'userB',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique: true})
  email: string;

  @Column({unique: true})
  firebaseUid: string; //this is the unique identifier from firebase auth.

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER_A })
  role: UserRole;

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];

  @OneToMany(() => Upload, (upload) => upload.user)
  uploads: Upload[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
