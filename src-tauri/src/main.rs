#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;
use serde::Serialize;
use std::{fs, path::Path};
use tauri::api::dialog;

#[derive(Serialize)]
struct TodoListFile {
  file_location: String,
  list: Vec<String>,
}

fn check_index_in_range(list: &[String], index: usize) -> Result<(), String> {
  if index >= list.len() {
    return Err(format!("{} is out of range.", index));
  }
  Ok(())
}

impl TodoListFile {
  fn save(&self) -> Result<(), String> {
    let final_content = self.list.join("\n");
    if let Err(error) = fs::write(&self.file_location, final_content) {
      return Err(error.to_string());
    }
    Ok(())
  }
}

fn main() {
  let mut file = TodoListFile {
    file_location: "".to_string(),
    list: vec![],
  };

  tauri::AppBuilder::new()
    .invoke_handler(move |_webview, arg| {
      use cmd::Cmd::*;
      match serde_json::from_str(arg) {
        Err(e) => Err(e.to_string()),
        Ok(command) => {
          match command {
            OpenFile => {
              let response = dialog::select(Option::Some("todo"), Option::None::<&Path>);

              if let Ok(dialog::Response::Okay(path)) = response {
                let read_result = fs::read_to_string(&path);

                match read_result {
                  Err(error) => {
                    println!("Cannot open file {}. Reason: {}", path, error);
                    return Err(format!("{}", error));
                  }
                  Ok(content) => {
                    file.file_location = path;
                    file.list = content
                      .split('\n')
                      .map(|s| s.to_string())
                      .collect::<Vec<String>>();
                  }
                }
              }
            }
            AddNewEntry => {
              file.list.push("".to_string());
              file.save()?;
            }
            UpdateEntry { index, new_value } => {
              check_index_in_range(&file.list, index)?;
              file.list[index] = new_value;
              file.save()?;
            }
            DeleteEntry { index } => {
              check_index_in_range(&file.list, index)?;
              file.list.remove(index);
              file.save()?;
            }
            MoveEntryUp { index } => {
              check_index_in_range(&file.list, index)?;
              if index == 0 {
                println!("Cannot move a top entry up");
                return Err("Cannot move a top entry up".to_string());
              }
              file.list.swap(index - 1, index);
              file.save()?;
            }
            MoveEntryDown { index } => {
              check_index_in_range(&file.list, index)?;
              if index + 1 >= file.list.len() {
                println!("Cannot move a bottom entry down");
                return Err("Cannot move a top entry down".to_string());
              }
              file.list.swap(index, index + 1);
              file.save()?;
            }
            GetFileContent { callback, error } => {
              // TODO: Get rid of clone
              let response = TodoListFile {
                file_location: file.file_location.clone(),
                list: file.list.clone(),
              };
              tauri::execute_promise(_webview, || Ok(response), callback, error)
            }
          }
          Ok(())
        }
      }
    })
    .build()
    .run();
}
