use serde_json;
use std::fs::File;
use std::io::{Cursor, Read};
use uesave::Save;

#[tauri::command]

async fn read_save(file_path: String) -> Result<String, String> {
    let mut file = File::open(&file_path).map_err(|e| e.to_string())?;

    let mut buffer = Vec::new();

    file.read_to_end(&mut buffer).map_err(|e| e.to_string())?;

    let mut cursor = Cursor::new(buffer);

    let save = Save::read(&mut cursor).map_err(|e| e.to_string())?;

    let json = serde_json::to_string(&save).map_err(|e| e.to_string())?;

    Ok(json)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 1. Force compositing off ONLY on Linux to prevent Wayland protocol crashes
    #[cfg(target_os = "linux")]
    std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_save])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
