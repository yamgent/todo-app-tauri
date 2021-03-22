import React from "react";
import { Button } from "antd";

interface Props {
  fileLocation: string | undefined;
  openFile: () => void;
}

export default function ActionsBar({ fileLocation, openFile }: Props) {
  return (
    <div style={{ backgroundColor: "#ffd8bf", padding: 8 }}>
      <Button type="primary" onClick={openFile} style={{ marginRight: 8 }}>
        Select file
      </Button>
      {fileLocation ? (
        <span>
          <b>Current file location:</b> {fileLocation}
        </span>
      ) : (
        <span>
          <b>No file loaded</b>
        </span>
      )}
    </div>
  );
}
