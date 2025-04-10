// test_rust/src/cli.rs

use std::{thread, time::Duration};

pub async fn run_cli() -> Result<(), Box<dyn std::error::Error>> {
    println!("⏱️ Rust CLI benchmark starting...");
    let start = std::time::Instant::now();

    // Giả lập công việc mất 500ms
    thread::sleep(Duration::from_millis(500));

    let duration = start.elapsed();
    println!("✅ Rust CLI benchmark done in {:.2?}", duration);

    Ok(())
}
