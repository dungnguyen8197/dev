import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {OrganizationType} from "./organization-type.entity";

@Entity({name: 'organization_division_types'})
export class OrganizationDivisionType extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty({example: 1})
    readonly id: number;

    @Column('int8', { comment: ' organization_types.id' })
    @ApiProperty({ example: 10 })
    organization_type_id: number;

    @CreateDateColumn()
    @ApiProperty({ example: '2021-07-01 00:00:00' })
    readonly created_at: Date;

    @UpdateDateColumn()
    @ApiProperty({ example: '2021-07-01 00:00:00' })
    readonly updated_at: Date;

    @Column({type: 'varchar', length: 50})
    @ApiProperty({example: '大学'})
    name: string;

    /**
     * Organization Type Relation
     */
    @ManyToOne(() => OrganizationType)
    @JoinColumn([{
      name: 'organization_type_id',
      referencedColumnName: 'id',
    }])
    organization_type: OrganizationType;
}