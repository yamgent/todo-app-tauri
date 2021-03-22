import React from "react";
import "antd/dist/antd.css";
import Title from "./Title";
import ActionsBar from "./ActionsBar";
import TodoList from "./TodoList";
import { invoke, promisified } from "tauri/api/tauri";

interface TodoListFile {
  file_location: string;
  list: string[];
}

export default function App() {
  const [file, setFile] = React.useState<TodoListFile>();

  const refreshContent = React.useCallback(async (): Promise<void> => {
    setFile(await promisified({ cmd: "getFileContent" }));
  }, []);

  React.useEffect((): void => {
    // in case only FE is reloaded
    refreshContent();
  }, [refreshContent]);

  const openFile = React.useCallback(() => {
    invoke({ cmd: "openFile" });
    refreshContent();
  }, [refreshContent]);

  const addNewEntry = React.useCallback((): void => {
    invoke({ cmd: "addNewEntry" });
    refreshContent();
  }, [refreshContent]);

  const updateEntry = React.useCallback(
    (updateIndex: number, newValue: string): void => {
      invoke({ cmd: "updateEntry", index: updateIndex, new_value: newValue });
      refreshContent();
    },
    [refreshContent]
  );

  const deleteEntry = React.useCallback(
    (deleteIndex: number): void => {
      invoke({ cmd: "deleteEntry", index: deleteIndex });
      refreshContent();
    },
    [refreshContent]
  );

  const moveEntryUp = React.useCallback(
    (moveIndex: number): void => {
      invoke({ cmd: "moveEntryUp", index: moveIndex });
      refreshContent();
    },
    [refreshContent]
  );

  const moveEntryDown = React.useCallback(
    (moveIndex: number): void => {
      invoke({ cmd: "moveEntryDown", index: moveIndex });
      refreshContent();
    },
    [refreshContent]
  );

  return (
    <>
      <Title />
      <ActionsBar fileLocation={file?.file_location} openFile={openFile} />
      <TodoList
        list={file?.list || []}
        hasFileLoaded={!!file}
        addNewEntry={addNewEntry}
        updateEntry={updateEntry}
        deleteEntry={deleteEntry}
        moveEntryUp={moveEntryUp}
        moveEntryDown={moveEntryDown}
      />
    </>
  );
}
