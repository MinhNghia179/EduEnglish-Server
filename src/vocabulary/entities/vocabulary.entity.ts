import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vocabulary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column()
  phonetic: string;

  @Column()
  meaning: string;

  @Column()
  example: string;

  @Column()
  image: string;

  @Column()
  type: string;

  @Column()
  audio: string;
}
