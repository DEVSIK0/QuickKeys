mod modules {
    pub mod commands;
    pub mod keyboard;
}

use modules::commands::{press_enter, press_key, type_text};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .invoke_handler(tauri::generate_handler![press_key, type_text, press_enter])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
