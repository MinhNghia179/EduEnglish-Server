import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Unique,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Topic } from './topic.entity';
import { User } from 'src/users/entities/user.entity';
import { TopicPermissionType } from 'src/common/types/topic';

@Entity('topic_permissions')
export class TopicPermission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Topic, (topic) => topic.permissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'topic_id' })
    topic: Topic;

    @ManyToOne(() => User, (user) => user.topicPermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'enum', enum: TopicPermissionType, default: TopicPermissionType.VIEW })
    permission: TopicPermissionType;

    @CreateDateColumn()
    createdAt: Date;
}
