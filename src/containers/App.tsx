import React from "react";
import "antd/dist/antd.css";
import Title from "./Title";
import ActionsBar from "./ActionsBar";
import { open } from "tauri/api/dialog";
import { readTextFile, writeFile } from "tauri/api/fs";
import TodoList from "./TodoList";

interface TodoListFile {
  fileLocation: string;
  list: string[];
}

export default function App() {
  const [file, setFile] = React.useState<TodoListFile>();

  const openFile = React.useCallback(async (): Promise<void> => {
    const newLocation = (await open({ filter: "todo" })) as string;
    const fileContent = (await readTextFile(newLocation)) as string;
    setFile({ fileLocation: newLocation, list: fileContent.split("\n") });
  }, []);

  React.useEffect((): void => {
    // write back to file when list is updated
    if (!file) return;
    writeFile({ path: file.fileLocation, contents: file.list.join("\n") });
  }, [file]);

  const addNewEntry = React.useCallback((): void => {
    if (!file) return;
    setFile({ ...file, list: [...file.list, ""] });
  }, [file]);

  const updateEntry = React.useCallback(
    (updateIndex: number, newValue: string): void => {
      if (!file) return;
      setFile({
        ...file,
        list: file.list.map((entry, index) =>
          index === updateIndex ? newValue : entry
        ),
      });
    },
    [file]
  );

  const deleteEntry = React.useCallback(
    (deleteIndex: number): void => {
      if (!file) return;
      setFile({
        ...file,
        list: file.list.filter((_, index) => index !== deleteIndex),
      });
    },
    [file]
  );

  const moveEntryUp = React.useCallback(
    (moveIndex: number): void => {
      if (!file) return;
      if (moveIndex === 0) return;

      const newList = [...file.list];
      newList[moveIndex] = file.list[moveIndex - 1];
      newList[moveIndex - 1] = file.list[moveIndex];
      setFile({ ...file, list: newList });
    },
    [file]
  );

  const moveEntryDown = React.useCallback(
    (moveIndex: number): void => {
      if (!file) return;
      if (moveIndex === file.list.length - 1) return;

      const newList = [...file.list];
      newList[moveIndex] = file.list[moveIndex + 1];
      newList[moveIndex + 1] = file.list[moveIndex];
      setFile({ ...file, list: newList });
    },
    [file]
  );

  return (
    <>
      <Title />
      <ActionsBar fileLocation={file?.fileLocation} openFile={openFile} />
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
