import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Topic } from 'src/topics/entities/topic.entity';
import { ChannelService } from './channel.service';
import { Channel } from './entities/channel.entity';
import { IChannel, IChannelWithTopics } from './interfaces';
import {
    toChannelResponse,
    toChannelWithTopics,
} from './transformers';

@Controller('channel')
@UseGuards(AuthGuard)
export class ChannelController {
    constructor(private readonly channelService: ChannelService) { }

    @Get('profile')
    async getMyChannel(
        @Req() req: Request & { user: { id: string } },
    ): Promise<IChannel> {
        const channel = await this.channelService.getMyChannel(req.user.id);
        return toChannelResponse(channel);
    }

    @Patch('update-profile')
    async updateMyChannel(
        @Body() dto: Partial<Channel>,
        @Req() req: Request & { user: { id: string } },
    ): Promise<IChannel> {
        const channel = await this.channelService.updateMyChannel(req.user.id, dto);
        return toChannelResponse(channel);
    }

    @Get(':id/profile')
    async getChannelById(
        @Param('id') id: string,
        @Req() req: Request & { user: { id: string } },
    ): Promise<IChannelWithTopics> {
        const channel = await this.channelService.getChannelById(id, req.user.id);
        return toChannelWithTopics(channel);
    }

    @Get(':id/topics')
    async getChannelTopics(
        @Param('id') id: string,
        @Req() req: Request & { user: { id: string } },
    ): Promise<Topic[]> {
        return await this.channelService.getChannelTopics(id, req.user.id);
    }

    @Post(':id/topics/:topicId')
    async addTopicToChannel(
        @Param('id') id: string,
        @Param('topicId') topicId: string,
        @Req() req: Request & { user: { id: string } },
    ): Promise<{ message: string }> {
        await this.channelService.addTopicToChannel(id, topicId, req.user.id);
        return { message: 'Topic added to channel successfully' };
    }

    @Delete(':id/topics/:topicId')
    async removeTopicFromChannel(
        @Param('id') id: string,
        @Param('topicId') topicId: string,
        @Req() req: Request & { user: { id: string } },
    ): Promise<{ message: string }> {
        await this.channelService.removeTopicFromChannel(id, topicId, req.user.id);
        return { message: 'Topic removed from channel successfully' };
    }
}
