import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

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
}
