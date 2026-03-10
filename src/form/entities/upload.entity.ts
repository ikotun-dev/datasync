//This holds the file user B uploads. 

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class File{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
