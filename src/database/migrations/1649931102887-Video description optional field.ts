import { MigrationInterface, QueryRunner } from 'typeorm';

export class VideoDescriptionOptionalField1649931102887
  implements MigrationInterface
{
  name = 'VideoDescriptionOptionalField1649931102887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "video"
            ALTER COLUMN "description" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "video"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
  }
}
