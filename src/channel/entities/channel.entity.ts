import { Topic } from 'src/topics/entities/topic.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('channels')
export class Channel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.channel, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @Column({ default: "" })
    name: string;

    @Column({ default: "" })
    description: string;

    @Column({ name: 'is_public', default: false })
    isPublic: boolean;

    @Column({ unique: true, nullable: true })
    handle: string;

    @Column({ name: "channel_url", unique: true, nullable: true })
    channelUrl: string;

    @Column({ name: "contact_info", default: '' })
    contactInfo: string;

    @Column({ name: "banner_url", default: '' })
    bannerUrl: string;

    @OneToMany(() => Topic, (topic) => topic.channel, { onDelete: 'CASCADE' })
    topics: Topic[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
