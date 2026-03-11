// Stores files uploaded by User B, linked to User A's account
import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Path/URL to the stored file
  @Column()
  fileUrl: string;

  // Original filename for reference
  @Column()
  fileName: string;

  // The User A account this file belongs to
  @ManyToOne(() => User, (user) => user.uploads, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
