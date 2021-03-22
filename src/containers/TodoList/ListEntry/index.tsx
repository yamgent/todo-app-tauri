import { DeleteOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React from "react";

// TODO: Can clean this up

enum Mode {
  View,
  Edit,
}

interface Props {
  index: number;
  value: string;
  canMoveDown: boolean;

  moveEntryUp: (index: number) => void;
  moveEntryDown: (index: number) => void;
  deleteEntry: (index: number) => void;
  updateEntry: (index: number, newValue: string) => void;
}

export default function ListEntry({
  index,
  value,
  canMoveDown,
  moveEntryUp,
  moveEntryDown,
  deleteEntry,
  updateEntry,
}: Props) {
  const canMoveUp = index !== 0;

  const [mode, setMode] = React.useState<Mode>(Mode.View);
  const [editValue, setEditValue] = React.useState(value);

  React.useEffect((): void => {
    setEditValue(value);
  }, [value]);

  const switchToEdit = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.stopPropagation();
      setMode(Mode.Edit);
    },
    []
  );

  const saveValue = React.useCallback((): void => {
    updateEntry(index, editValue);
    setMode(Mode.View);
  }, [updateEntry, index, editValue]);

  return (
    <div style={{ padding: 8, display: "flex", alignItems: "center" }}>
      <div style={{ marginRight: 16 }}>{index + 1}.</div>
      <div style={{ marginRight: 16 }}>
        <Button disabled={!canMoveUp} onClick={() => moveEntryUp(index)}>
          <UpOutlined />
        </Button>
        <Button disabled={!canMoveDown} onClick={() => moveEntryDown(index)}>
          <DownOutlined />
        </Button>
        <Button onClick={() => deleteEntry(index)}>
          <DeleteOutlined />
        </Button>
      </div>
      {mode === Mode.View ? (
        <div style={{ flex: 1 }} onClick={switchToEdit}>
          {value ? (
            <span>{value}</span>
          ) : (
            <span style={{ fontStyle: "italic" }}>empty</span>
          )}
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          <Input
            value={editValue}
            autoFocus
            onChange={(e) => setEditValue(e.currentTarget.value)}
            onBlur={saveValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveValue();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
