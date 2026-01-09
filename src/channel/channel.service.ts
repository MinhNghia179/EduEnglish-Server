import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { generateChannelId } from 'src/common/utils';
import { IChannel } from './interfaces';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,
        @InjectRepository(Topic)
        private topicRepository: Repository<Topic>,
    ) { }

    /**
     * Get user's channel with all topics
     */
    async getMyChannel(userId: string): Promise<Channel> {
        const channel = await this.channelRepository.findOne({
            where: { user_id: userId },
            relations: ['topics'],
        });

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }

        return channel;
    }

    /**
     * Get channel by ID (public channels only or owner)
     */
    async getChannelById(channelId: string, userId?: string): Promise<Channel> {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: ['topics'],
        });

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }

        // Check if channel is private and user is not the owner
        if (!channel.isPublic && channel.user_id !== userId) {
            throw new ForbiddenException('You do not have access to this channel');
        }

        return channel;
    }

    /**
     * Update channel information
     */
    async updateMyChannel(
        userId: string,
        dto: Partial<IChannel>,
    ): Promise<Channel> {
        const channel = await this.channelRepository.findOne({ where: { user_id: userId } });

        if (!channel) throw new NotFoundException('Channel not found');

        channel.name = dto.name || channel.name;
        channel.description = dto.description || channel.description;
        channel.contactInfo = dto.contactInfo || channel.contactInfo;
        channel.handle = dto.handle || channel.handle;

        return await this.channelRepository.save(channel);
    }

    /**
     * Get all topics in a channel
     */
    async getChannelTopics(channelId: string, userId?: string): Promise<Topic[]> {
        const channel = await this.getChannelById(channelId, userId);
        return channel.topics || [];
    }

    /**
     * Create my channel
     */
    async createMyChannel(userId: string): Promise<Channel> {
        const channelId = generateChannelId();
        const channel = await this.channelRepository.create({
            user_id: userId,
            channelUrl: channelId
        });
        return await this.channelRepository.save(channel);
    }

    /**
     * Add topic to channel
     */
    async addTopicToChannel(
        channelId: string,
        topicId: string,
        userId: string,
    ): Promise<void> {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
        });

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }

        // Check if user is the owner
        if (channel.user_id !== userId) {
            throw new ForbiddenException('You do not have permission to modify this channel');
        }

        const topic = await this.topicRepository.findOne({
            where: { id: topicId },
        });

        if (!topic) {
            throw new NotFoundException('Topic not found');
        }

        // Update topic's channel
        topic.channel_id = channelId;
        await this.topicRepository.save(topic);
    }

    /**
     * Remove topic from channel
     */
    async removeTopicFromChannel(
        channelId: string,
        topicId: string,
        userId: string,
    ): Promise<void> {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
        });

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }

        // Check if user is the owner
        if (channel.user_id !== userId) {
            throw new ForbiddenException('You do not have permission to modify this channel');
        }

        const topic = await this.topicRepository.findOne({
            where: { id: topicId, channel_id: channelId },
        });

        if (!topic) {
            throw new NotFoundException('Topic not found in this channel');
        }

        // Remove topic from channel
        topic.channel_id = null;
        await this.topicRepository.save(topic);
    }
}
