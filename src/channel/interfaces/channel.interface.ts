import { Topic } from 'src/topics/entities/topic.entity';

/**
 * Interface for Channel response data
 */
export interface IChannel {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    handle: string;
    channelUrl: string;
    bannerUrl: string;
    contactInfo: string;
}

/**
 * Extended Channel interface with topics
 */
export interface IChannelWithTopics extends IChannel {
    topics: Topic[];
}

/**
 * Channel with topic count
 */
export interface IChannelWithCount extends IChannel {
    topicCount: number;
}
