use serde::Deserialize;

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
  OpenFile,
  AddNewEntry,
  UpdateEntry { index: usize, new_value: String },
  DeleteEntry { index: usize },
  MoveEntryUp { index: usize },
  MoveEntryDown { index: usize },
  GetFileContent { callback: String, error: String },
}
