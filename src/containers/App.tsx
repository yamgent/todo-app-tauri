import React from "react";
import "antd/dist/antd.css";
import Title from "./Title";
import ActionsBar from "./ActionsBar";
import { open } from "tauri/api/dialog";
import { readTextFile } from "tauri/api/fs";
import TodoList from "./TodoList";

export default function App() {
  const [fileLocation, setFileLocation] = React.useState<string>();
  const [list, setList] = React.useState<string[]>([]);

  const openFile = React.useCallback(async (): Promise<void> => {
    const newLocation = (await open({ filter: "todo" })) as string;
    const fileContent = (await readTextFile(newLocation)) as string;

    setFileLocation(newLocation);
    setList(fileContent.split("\n"));
  }, []);

  const addNewEntry = React.useCallback((): void => {
    setList([...list, ""]);
  }, [list]);

  const updateEntry = React.useCallback(
    (updateIndex: number, newValue: string): void => {
      setList(
        list.map((entry, index) => (index === updateIndex ? newValue : entry))
      );
    },
    [list]
  );

  const deleteEntry = React.useCallback(
    (deleteIndex: number): void => {
      setList(list.filter((_, index) => index !== deleteIndex));
    },
    [list]
  );

  const moveEntryUp = React.useCallback(
    (moveIndex: number): void => {
      if (moveIndex === 0) {
        return;
      }

      const newList = [...list];
      newList[moveIndex] = list[moveIndex - 1];
      newList[moveIndex - 1] = list[moveIndex];
      setList(newList);
    },
    [list]
  );

  const moveEntryDown = React.useCallback(
    (moveIndex: number): void => {
      if (moveIndex === list.length - 1) {
        return;
      }

      const newList = [...list];
      newList[moveIndex] = list[moveIndex + 1];
      newList[moveIndex + 1] = list[moveIndex];
      setList(newList);
    },
    [list]
  );

  return (
    <>
      <Title />
      <ActionsBar fileLocation={fileLocation} openFile={openFile} />
      <TodoList
        list={list}
        hasFileLoaded={!!fileLocation}
        addNewEntry={addNewEntry}
        updateEntry={updateEntry}
        deleteEntry={deleteEntry}
        moveEntryUp={moveEntryUp}
        moveEntryDown={moveEntryDown}
      />
    </>
  );
}
