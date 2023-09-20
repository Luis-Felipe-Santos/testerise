import { Entity, PrimaryGeneratedColumn,  Column } from 'typeorm';

@Entity('plans')
class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  descricao: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;
}

export default Plan;