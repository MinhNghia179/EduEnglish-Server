import { User } from '../entities/user.entity';
import {
    IUser,
    IUserFull,
    IUserWithPermissions,
    IUserWithTopics,
} from '../interfaces/user.interface';

/**
 * Transform User entity to IUser interface
 * Excludes sensitive information like password, refresh token, etc.
 */
export function toUserResponse(user: User): IUser {
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        age: user.age,
        exp: user.exp,
        level: user.level,
        avatarUrl: user.avatarUrl,
        country: user.country,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

/**
 * Transform User entity to IUserWithTopics interface
 */
export function toUserWithTopics(user: User): IUserWithTopics {
    return {
        ...toUserResponse(user),
        topics: user.topics || [],
    };
}

/**
 * Transform User entity to IUserWithPermissions interface
 */
export function toUserWithPermissions(user: User): IUserWithPermissions {
    return {
        ...toUserResponse(user),
        topicPermissions: user.topicPermissions || [],
    };
}

/**
 * Transform User entity to IUserFull interface
 */
export function toUserFull(user: User): IUserFull {
    return {
        ...toUserResponse(user),
        topics: user.topics || [],
        topicPermissions: user.topicPermissions || [],
    };
}
