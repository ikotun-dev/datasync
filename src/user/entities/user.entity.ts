import { Company } from 'src/form/entities/company.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique: true})
  email: string;

  @Column({unique: true})
  firebaseUid: string; //this is the unique identifier from firebase auth. 

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}
