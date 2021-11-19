import React, { useRef } from "react";
import "./resized-textaera.css"

type ResizedTextareaProps = {} & React.HTMLProps<HTMLTextAreaElement>;

const ResizedTextarea = (props: ResizedTextareaProps) => {
  const textaeraRef = useRef<HTMLTextAreaElement>(null);
  const value = (((textaeraRef.current || {}).value) || "") + " ";

  return <div className = "input-resized-textarea"><textarea ref = { textaeraRef } {...props}/><p>{value}</p></div>
}

export { ResizedTextarea }
