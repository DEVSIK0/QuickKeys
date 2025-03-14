use enigo::{Direction, Enigo, Key, Keyboard};
use std::collections::HashMap;

pub fn map_char_to_key(letter: char) -> Option<Key> {
    let mut key_map: HashMap<char, Key> = HashMap::new();

    key_map.insert('a', enigo::Key::A);
    key_map.insert('b', enigo::Key::B);
    key_map.insert('c', enigo::Key::C);
    key_map.insert('d', enigo::Key::D);
    key_map.insert('e', enigo::Key::E);
    key_map.insert('f', enigo::Key::F);
    key_map.insert('g', enigo::Key::G);
    key_map.insert('h', enigo::Key::H);
    key_map.insert('i', enigo::Key::I);
    key_map.insert('j', enigo::Key::J);
    key_map.insert('k', enigo::Key::K);
    key_map.insert('l', enigo::Key::L);
    key_map.insert('m', enigo::Key::M);
    key_map.insert('n', enigo::Key::N);
    key_map.insert('o', enigo::Key::O);
    key_map.insert('p', enigo::Key::P);
    key_map.insert('q', enigo::Key::Q);
    key_map.insert('r', enigo::Key::R);
    key_map.insert('s', enigo::Key::S);
    key_map.insert('t', enigo::Key::T);
    key_map.insert('u', enigo::Key::U);
    key_map.insert('v', enigo::Key::V);
    key_map.insert('w', enigo::Key::W);
    key_map.insert('x', enigo::Key::X);
    key_map.insert('y', enigo::Key::Y);
    key_map.insert('z', enigo::Key::Z);

    key_map.insert('0', enigo::Key::Num0);
    key_map.insert('1', enigo::Key::Num1);
    key_map.insert('2', enigo::Key::Num2);
    key_map.insert('3', enigo::Key::Num3);
    key_map.insert('4', enigo::Key::Num4);
    key_map.insert('5', enigo::Key::Num5);
    key_map.insert('6', enigo::Key::Num6);
    key_map.insert('7', enigo::Key::Num7);
    key_map.insert('8', enigo::Key::Num8);
    key_map.insert('9', enigo::Key::Num9);
    key_map.insert(' ', enigo::Key::Space);
    key_map.insert(',', enigo::Key::OEMComma);

    return key_map.get(&letter.to_ascii_lowercase()).cloned();
}

pub fn type_text_with_enigo(enigo: &mut Enigo, text: &str) -> Result<(), String> {
    for letter in text.chars() {
        let is_uppercase = letter.is_ascii_uppercase();
        if is_uppercase {
            enigo
                .key(enigo::Key::LShift, Direction::Press)
                .map_err(|e| e.to_string())?;
        }

        let key = match map_char_to_key(letter) {
            Some(k) => k,
            None => {
                continue;
            }
        };

        enigo
            .key(key, Direction::Click)
            .map_err(|e| e.to_string())?;

        if is_uppercase {
            enigo
                .key(enigo::Key::LShift, Direction::Release)
                .map_err(|e| e.to_string())?;
        }
    }

    return Ok(());
}
