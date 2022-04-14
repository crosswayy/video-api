import {MigrationInterface, QueryRunner} from "typeorm";

export class ManyToManyRelationshipWithUsersAndVideos1649976143384 implements MigrationInterface {
    name = 'ManyToManyRelationshipWithUsersAndVideos1649976143384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "videos_users" (
                "video" uuid NOT NULL,
                "user" uuid NOT NULL,
                CONSTRAINT "PK_e3b087e4cd039296e3ccfc6f302" PRIMARY KEY ("video", "user")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ad5f491967cec7b180fa9d6b78" ON "videos_users" ("video")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e65ee7b3ea16502f40bc320c05" ON "videos_users" ("user")
        `);
        await queryRunner.query(`
            ALTER TABLE "videos_users"
            ADD CONSTRAINT "FK_ad5f491967cec7b180fa9d6b78d" FOREIGN KEY ("video") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "videos_users"
            ADD CONSTRAINT "FK_e65ee7b3ea16502f40bc320c054" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "videos_users" DROP CONSTRAINT "FK_e65ee7b3ea16502f40bc320c054"
        `);
        await queryRunner.query(`
            ALTER TABLE "videos_users" DROP CONSTRAINT "FK_ad5f491967cec7b180fa9d6b78d"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e65ee7b3ea16502f40bc320c05"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ad5f491967cec7b180fa9d6b78"
        `);
        await queryRunner.query(`
            DROP TABLE "videos_users"
        `);
    }

}
