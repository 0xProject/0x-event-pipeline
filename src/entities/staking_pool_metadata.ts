import { Column, Entity, PrimaryColumn } from 'typeorm';

// Event emitted when a staking pool's operator share is decreased.
@Entity({ name: 'staking_pool_metadata', schema: 'staking' })
export class StakingPoolMetadata {
    // Unique Id of pool.
    @PrimaryColumn({ name: 'pool_id', type: 'varchar' })
    public poolId!: string;
    // Name of the pool
    @Column({ name: 'name', type: 'varchar' })
    public name!: string;
    // website of the pool operator
    @Column({ name: 'website', type: 'varchar', nullable: true })
    public website!: string | null;
    // website of the pool operator
    @Column({ name: 'bio', type: 'varchar', nullable: true })
    public bio!: string | null;
    // location of the pool operator
    @Column({ name: 'location', type: 'varchar', nullable: true })
    public location!: string | null;
    // link to logo of the pool operator
    @Column({ name: 'logo_url', type: 'varchar', nullable: true })
    public logoUrl!: string | null;
    // whether or not the info has been verified by the 0x core team
    @Column({ name: 'verified', type: 'boolean' })
    public verified!: boolean;
}
