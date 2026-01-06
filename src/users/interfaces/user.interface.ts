import { TopicPermission } from 'src/topics/entities/topic-permission.entity';
import { Topic } from 'src/topics/entities/topics.entity';

/**
 * Interface for User response data
 * Contains only the necessary information to return to the client
 */
export interface IUser {
    id: string;
    email: string;
    fullName: string;
    age: number;
    exp: number;
    level: number;
    avatarUrl: string | null;
    country: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Extended User interface with topics
 */
export interface IUserWithTopics extends IUser {
    topics: Topic[];
}

/**
 * Extended User interface with topic permissions
 */
export interface IUserWithPermissions extends IUser {
    topicPermissions: TopicPermission[];
}

/**
 * Full User interface with all relations
 */
export interface IUserFull extends IUser {
    topics: Topic[];
    topicPermissions: TopicPermission[];
}

/**
 * User authentication response
 */
export interface IUserAuth extends IUser {
    accessToken: string;
    refreshToken: string;
}
