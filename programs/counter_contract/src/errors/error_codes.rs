use anchor_lang::prelude::*;

#[error_code]
pub enum CounterError {
    #[msg("Cannot decrement below zero.")]
    CountUnderflow,
    #[msg("Unauthorized: You are not the owner of this counter.")]
    Unauthorized, // Example of another error, though has_one handles this implicitly
}