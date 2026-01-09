import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1767945363744 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` varchar(36) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`full_name\` varchar(255) NOT NULL,
                \`age\` int NOT NULL DEFAULT '25',
                \`exp\` int NOT NULL DEFAULT '1',
                \`level\` int NOT NULL DEFAULT '1',
                \`avatar_url\` varchar(255) NULL DEFAULT NULL,
                \`country\` varchar(255) NOT NULL DEFAULT 'vn',
                \`password_hash\` varchar(255) NULL DEFAULT NULL,
                \`refresh_token\` varchar(255) NULL DEFAULT NULL,
                \`is_active\` tinyint NOT NULL DEFAULT '0',
                \`otp_code\` varchar(6) NULL DEFAULT NULL,
                \`otp_expired_at\` varchar(255) NULL DEFAULT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`IDX_users_email\` (\`email\`),
                UNIQUE KEY \`IDX_users_otp_code\` (\`otp_code\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create channels table
        await queryRunner.query(`
            CREATE TABLE \`channels\` (
                \`id\` varchar(36) NOT NULL,
                \`user_id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL DEFAULT '',
                \`description\` varchar(255) NOT NULL DEFAULT '',
                \`is_public\` tinyint NOT NULL DEFAULT '0',
                \`handle\` varchar(255) NULL DEFAULT NULL,
                \`channel_url\` varchar(255) NULL DEFAULT NULL,
                \`contact_info\` varchar(255) NOT NULL DEFAULT '',
                \`banner_url\` varchar(255) NOT NULL DEFAULT '',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`IDX_channels_handle\` (\`handle\`),
                UNIQUE KEY \`IDX_channels_channel_url\` (\`channel_url\`),
                UNIQUE KEY \`REL_channels_user_id\` (\`user_id\`),
                CONSTRAINT \`FK_channels_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create topics table
        await queryRunner.query(`
            CREATE TABLE \`topics\` (
                \`id\` varchar(36) NOT NULL,
                \`user_id\` varchar(36) NOT NULL,
                \`channel_id\` varchar(36) NULL DEFAULT NULL,
                \`title\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                \`image_url\` varchar(255) NOT NULL,
                \`video_url\` varchar(255) NOT NULL,
                \`number_of_questions\` int NOT NULL,
                \`created_at\` datetime NOT NULL,
                \`updated_at\` datetime NOT NULL,
                PRIMARY KEY (\`id\`),
                KEY \`FK_topics_user_id\` (\`user_id\`),
                KEY \`FK_topics_channel_id\` (\`channel_id\`),
                CONSTRAINT \`FK_topics_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_topics_channel_id\` FOREIGN KEY (\`channel_id\`) REFERENCES \`channels\` (\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Create topic_permissions table
        await queryRunner.query(`
            CREATE TABLE \`topic_permissions\` (
                \`id\` varchar(36) NOT NULL,
                \`topic_id\` varchar(36) NOT NULL,
                \`user_id\` varchar(36) NOT NULL,
                \`permission\` enum('VIEW', 'EDIT') NOT NULL DEFAULT 'VIEW',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`),
                KEY \`FK_topic_permissions_topic_id\` (\`topic_id\`),
                KEY \`FK_topic_permissions_user_id\` (\`user_id\`),
                CONSTRAINT \`FK_topic_permissions_topic_id\` FOREIGN KEY (\`topic_id\`) REFERENCES \`topics\` (\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_topic_permissions_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order to respect foreign key constraints
        await queryRunner.query(`DROP TABLE IF EXISTS \`topic_permissions\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`topics\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`channels\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`users\``);
    }

}
