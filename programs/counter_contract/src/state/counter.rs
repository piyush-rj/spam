use anchor_lang::prelude::*;

#[account]
pub struct Counter {
    pub count: u64,
    pub owner: Pubkey, // To demonstrate ownership, though not strictly used in all instructions
}

impl Space for Counter {
    const INIT_SPACE: usize = 8 + // Discriminator
                              8 + // count: u64
                              32; // owner: Pubkey
}