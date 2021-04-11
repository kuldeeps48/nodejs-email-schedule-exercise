import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class EmailRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, default: false })
  sentHelloMail: boolean;
}
