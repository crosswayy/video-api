import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1649765145930 implements MigrationInterface {
  name = 'init1649765145930';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "email" character varying NOT NULL,
                "hash" character varying NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "video" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "description" character varying NOT NULL,
                "link" character varying NOT NULL,
                CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "video"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}
