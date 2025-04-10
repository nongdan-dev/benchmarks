use futures_util::{SinkExt, StreamExt};
use warp::Filter;

pub async fn run_websocket() -> std::io::Result<()> {
    let websocket_route = warp::path("ws")
        .and(warp::ws())
        .map(|ws: warp::ws::Ws| {
            ws.on_upgrade(|websocket| async move {
                let (mut tx, mut rx) = websocket.split();

                while let Some(result) = rx.next().await {
                    if let Ok(msg) = result {
                        if msg.is_text() || msg.is_binary() {
                            if tx.send(msg).await.is_err() {
                                break;
                            }
                        }
                    }
                }
            })
        });

    println!("🚀 WebSocket server running at ws://127.0.0.1:9001/ws");

    // Wrap warp::serve().await trong tokio::spawn để tránh block thread nếu cần
    warp::serve(websocket_route)
        .run(([127, 0, 0, 1], 9001))
        .await;

    Ok(())
}
