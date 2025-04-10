use dotenvy::dotenv;
use tokio::task::LocalSet;

mod api;
mod cli;
mod websocket;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    dotenv().ok();

    let args: Vec<String> = std::env::args().collect();
    let Some(command) = args.get(1) else {
        eprintln!("❗ Please provide a command: api | websocket | cli | all");
        return;
    };

    match command.as_str() {
        "api" => {
            if let Err(e) = api::run_api().await {
                eprintln!("❌ API exited with error: {e:?}");
            }
        }
        "cli" => {
            if let Err(e) = cli::run_cli().await {
                eprintln!("❌ CLI exited with error: {e:?}");
            }
        }
        "websocket" => {
            if let Err(e) = websocket::run_websocket().await {
                eprintln!("❌ WebSocket exited with error: {e:?}");
            }
        }
        "all" => {
            let local = LocalSet::new();

            local.spawn_local(async {
                if let Err(e) = api::run_api().await {
                    eprintln!("❌ API error: {e:?}");
                }
            });

            local.spawn_local(async {
                if let Err(e) = websocket::run_websocket().await {
                    eprintln!("❌ WebSocket error: {e:?}");
                }
            });

            local.spawn_local(async {
                if let Err(e) = cli::run_cli().await {
                    eprintln!("❌ CLI error: {e:?}");
                }
            });

            local.await;
        }
        _ => {
            eprintln!("❗ Unknown command: {command}. Try: api | websocket | cli | all");
        }
    }
}
