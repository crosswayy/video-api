import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImplementOneToManyRelationshipForVideos1649884945045
  implements MigrationInterface
{
  name = 'ImplementOneToManyRelationshipForVideos1649884945045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "video"
            ADD "user_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "video"
            ADD CONSTRAINT "FK_0c06b8d2494611b35c67296356c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "video" DROP CONSTRAINT "FK_0c06b8d2494611b35c67296356c"
        `);
    await queryRunner.query(`
            ALTER TABLE "video" DROP COLUMN "user_id"
        `);
  }
}
