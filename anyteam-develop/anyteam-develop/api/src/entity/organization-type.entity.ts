import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import { OrganizationDivisionType } from "./organization-division-type.entity";

@Entity({name: 'organization_types'})
export class OrganizationType extends BaseEntity{
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1 })
    readonly id: number;

    @CreateDateColumn()
    @ApiProperty({ example: '2021-07-01 00:00:00' })
    readonly created_at: Date;

    @UpdateDateColumn()
    @ApiProperty({ example: '2021-07-01 00:00:00' })
    readonly updated_at: Date;

    @Column({type: 'varchar', length: 50})
    @ApiProperty({example: '学校'})
    name: string;

    @OneToMany(type => OrganizationDivisionType, organizationDivisionType => organizationDivisionType.organization_type)
    organization_division_types: OrganizationDivisionType[];
}