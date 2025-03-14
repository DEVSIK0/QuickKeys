use crate::modules::keyboard;

use enigo::{Direction, Enigo, Key, Keyboard, Settings};
use std::thread;
use std::time::Duration;

static PRESS_DELAY: Duration = Duration::from_millis(30);

#[tauri::command]
pub fn press_key(key: char) -> Result<(), String> {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    enigo
        .key(Key::Unicode(key.to_ascii_lowercase()), Direction::Click)
        .unwrap();
    thread::sleep(PRESS_DELAY);
    return Ok(());
}

#[tauri::command]
pub fn press_enter() -> Result<(), String> {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    enigo
        .key(Key::Return, Direction::Click)
        .map_err(|error| error.to_string())?;
    return Ok(());
}

#[tauri::command]
pub fn type_text(text: String) -> Result<(), String> {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    keyboard::type_text_with_enigo(&mut enigo, &text)?;
    return Ok(());
}
