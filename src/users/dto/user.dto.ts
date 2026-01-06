import { TopicPermission } from "src/topics/entities/topic-permission.entity";
import { Topic } from "src/topics/entities/topic.entity";

export class UserDto {
  id: string;
  email: string;
  fullName: string;
  age: number;
  exp: number;
  level: number;
  avatarUrl: string | null;
  country: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  topicPermissions?: TopicPermission[];
  topics?: Topic[];
}
