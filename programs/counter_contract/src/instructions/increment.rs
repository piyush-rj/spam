use anchor_lang::prelude::*;
use crate::state::Counter;

#[derive(Accounts)]
pub struct UpdateCounter<'info> {
    #[account(
        mut,
        has_one = owner, // Ensure the signer is the owner of the counter
        seeds = [b"counter", owner.key().as_ref()],
        bump = counter.bump
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub owner: Signer<'info>, // The owner of the counter account
}

pub fn handler(ctx: Context<UpdateCounter>) -> Result<()> {
    let counter = &mut ctx.accounts.counter;
    counter.count = counter.count.checked_add(1).unwrap(); // Using unwrap for simplicity, can use custom error
    Ok(())
}