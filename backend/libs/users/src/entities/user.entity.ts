import { Exclude, Expose } from 'class-transformer';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { UserRole } from '../interfaces/role.interface';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true, name: 'first_name' })
  firstName?: string;

  @Column({ nullable: true, name: 'last_name' })
  lastName?: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ nullable: true, name: 'phone_code' })
  mobileCode?: string;

  @Column({ default: true })
  active: boolean;

  @Column({
    type: 'simple-array',
    default: [UserRole.USER],
    transformer: {
      from: (value) => JSON.parse(value),
      to: (value) => JSON.stringify(value),
    },
  })
  roles: UserRole[];

  @Column({ default: false, name: 'email_verified' })
  emailVerified: boolean;

  @Column({ default: false, name: 'phone_verified' })
  phoneVerified: boolean;

  @Column({ default: true, name: 'is_first_login' })
  isFirstLogin: boolean;

  @Column({
    name: 'last_login_at',
    type: 'timestamp without time zone',
    nullable: true,
  })
  lastLoginAt: Date;

  @Expose({})
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
