import React from "react";
import { Button, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  hasFileLoaded: boolean;
  addNewEntry: () => void;
}

export default function ActionsBar({ hasFileLoaded, addNewEntry }: Props) {
  return (
    <Tooltip
      title={!hasFileLoaded && "You must load a file to perform any actions."}
      placement="right"
    >
      <Button disabled={!hasFileLoaded} onClick={addNewEntry}>
        <PlusOutlined /> Add new entry
      </Button>
    </Tooltip>
  );
}
