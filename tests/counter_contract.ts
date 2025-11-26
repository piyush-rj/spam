import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterContract } from "../target/types/counter_contract";
import { assert } from "chai";

describe("counter_contract", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CounterContract as Program<CounterContract>;

  // Generate a new keypair for the counter owner
  const counterOwner = anchor.web3.Keypair.generate();

  // Derive the PDA for the counter account
  let counterPda: anchor.web3.PublicKey;
  let counterBump: number;

  before(async () => {
    // Airdrop SOL to the counterOwner
    await provider.connection.requestAirdrop(
      counterOwner.publicKey,
      100 * anchor.web3.LAMPORTS_PER_SOL
    );

    // Derive the PDA for the counter account
    [counterPda, counterBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("counter"), counterOwner.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Is initialized!", async () => {
    // Add your test here.
    await program.methods
      .initialize()
      .accounts({
        counter: counterPda,
        signer: counterOwner.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counterOwner])
      .rpc();

    const counterAccount = await program.account.counter.fetch(counterPda);
    assert.equal(counterAccount.count.toNumber(), 0);
    assert.ok(counterAccount.owner.equals(counterOwner.publicKey));
    console.log("Counter initialized with count:", counterAccount.count.toNumber());
  });

  it("Increments the counter!", async () => {
    await program.methods
      .increment()
      .accounts({
        counter: counterPda,
        owner: counterOwner.publicKey,
      })
      .signers([counterOwner])
      .rpc();

    const counterAccount = await program.account.counter.fetch(counterPda);
    assert.equal(counterAccount.count.toNumber(), 1);
    console.log("Counter incremented to:", counterAccount.count.toNumber());
  });

  it("Decrements the counter!", async () => {
    await program.methods
      .decrement()
      .accounts({
        counter: counterPda,
        owner: counterOwner.publicKey,
      })
      .signers([counterOwner])
      .rpc();

    const counterAccount = await program.account.counter.fetch(counterPda);
    assert.equal(counterAccount.count.toNumber(), 0);
    console.log("Counter decremented to:", counterAccount.count.toNumber());
  });

  it("Fails to decrement below zero (underflow)!", async () => {
    try {
      await program.methods
        .decrement()
        .accounts({
          counter: counterPda,
          owner: counterOwner.publicKey,
        })
        .signers([counterOwner])
        .rpc();
      assert.fail("The instruction should have failed with an underflow error.");
    } catch (error) {
      assert.include(error.message, "Cannot decrement below zero.");
      console.log("Successfully caught expected underflow error:", error.message);
    }
  });

  it("Resets the counter!", async () => {
    // First, increment it a few times to ensure it's not zero
    await program.methods
      .increment()
      .accounts({
        counter: counterPda,
        owner: counterOwner.publicKey,
      })
      .signers([counterOwner])
      .rpc();
    await program.methods
      .increment()
      .accounts({
        counter: counterPda,
        owner: counterOwner.publicKey,
      })
      .signers([counterOwner])
      .rpc();

    let counterAccount = await program.account.counter.fetch(counterPda);
    assert.equal(counterAccount.count.toNumber(), 2);
    console.log("Counter before reset:", counterAccount.count.toNumber());

    // Now reset
    await program.methods
      .reset()
      .accounts({
        counter: counterPda,
        owner: counterOwner.publicKey,
      })
      .signers([counterOwner])
      .rpc();

    counterAccount = await program.account.counter.fetch(counterPda);
    assert.equal(counterAccount.count.toNumber(), 0);
    console.log("Counter reset to:", counterAccount.count.toNumber());
  });

  it("Fails to update if not the owner", async () => {
    const maliciousUser = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(
      maliciousUser.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );

    try {
      await program.methods
        .increment()
        .accounts({
          counter: counterPda,
          owner: maliciousUser.publicKey, // Malicious user tries to increment
        })
        .signers([maliciousUser])
        .rpc();
      assert.fail("The instruction should have failed due to unauthorized access.");
    } catch (error) {
      assert.include(error.message, "A has_one constraint was violated");
      console.log("Successfully caught expected unauthorized error:", error.message);
    }
  });
});