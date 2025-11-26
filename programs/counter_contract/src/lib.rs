use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;
use state::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Replace with your program ID

#[program]
pub mod counter_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }

    pub fn increment(ctx: Context<UpdateCounter>) -> Result<()> {
        instructions::increment::handler(ctx)
    }

    pub fn decrement(ctx: Context<UpdateCounter>) -> Result<()> {
        instructions::decrement::handler(ctx)
    }

    pub fn reset(ctx: Context<UpdateCounter>) -> Result<()> {
        instructions::reset::handler(ctx)
    }
}