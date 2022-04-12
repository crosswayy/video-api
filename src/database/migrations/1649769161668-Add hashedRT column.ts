import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHashedRTColumn1649769161668 implements MigrationInterface {
  name = 'AddHashedRTColumn1649769161668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "hashedRT" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "hashedRT"
        `);
  }
}
