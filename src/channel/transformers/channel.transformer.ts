import { Channel } from '../entities/channel.entity';
import {
    IChannel,
    IChannelWithCount,
    IChannelWithTopics,
} from '../interfaces/channel.interface';

/**
 * Transform Channel entity to IChannel interface
 */
export function toChannelResponse(channel: Channel): IChannel {
    return {
        id: channel.id,
        name: channel.name,
        description: channel.description,
        isPublic: channel.isPublic,
        createdAt: channel.createdAt,
        updatedAt: channel.updatedAt,
        bannerUrl: channel.bannerUrl,
        contactInfo: channel.contactInfo,
        channelUrl: channel.channelUrl,
        handle: channel.handle,
    };
}

/**
 * Transform Channel entity to IChannelWithTopics interface
 */
export function toChannelWithTopics(channel: Channel): IChannelWithTopics {
    return {
        ...toChannelResponse(channel),
        topics: channel.topics || [],
    };
}

/**
 * Transform Channel entity to IChannelWithCount interface
 */
export function toChannelWithCount(channel: Channel): IChannelWithCount {
    return {
        ...toChannelResponse(channel),
        topicCount: channel.topics?.length || 0,
    };
}
