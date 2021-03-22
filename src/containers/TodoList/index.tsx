import React from "react";
import ActionsBar from "./ActionsBar";
import ListEntry from "./ListEntry";

interface Props {
  list: string[];
  hasFileLoaded: boolean;

  addNewEntry: () => void;
  moveEntryUp: (index: number) => void;
  moveEntryDown: (index: number) => void;
  updateEntry: (index: number, newValue: string) => void;
  deleteEntry: (index: number) => void;
}

export default function TodoList({
  list,
  hasFileLoaded,
  addNewEntry,
  moveEntryUp,
  moveEntryDown,
  updateEntry,
  deleteEntry,
}: Props) {
  return (
    <div style={{ backgroundColor: "#feffe6", padding: 8 }}>
      <ActionsBar addNewEntry={addNewEntry} hasFileLoaded={hasFileLoaded} />
      <div style={{ padding: 8 }}>
        {list.map((entry, index) => (
          <ListEntry
            index={index}
            value={entry}
            moveEntryUp={moveEntryUp}
            moveEntryDown={moveEntryDown}
            updateEntry={updateEntry}
            deleteEntry={deleteEntry}
            canMoveDown={index !== list.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
