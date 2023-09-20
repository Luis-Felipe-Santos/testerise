import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePlansTable1695159811050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "plans",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "descricao",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "valor",
            type: "decimal",
            precision: 10, 
            scale: 2,
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
