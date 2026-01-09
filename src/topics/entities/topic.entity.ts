import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TopicPermission } from './topic-permission.entity';

@Entity("topics")
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Channel, (channel) => channel.topics, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @Column({ nullable: true })
  channel_id: string | null;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image_url: string;

  @Column()
  video_url: string;

  @Column()
  number_of_questions: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @OneToMany(() => TopicPermission, (topicPermission) => topicPermission.topic)
  permissions: TopicPermission[];
}
