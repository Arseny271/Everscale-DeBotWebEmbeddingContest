import { useState, useEffect } from 'react';

function useEditable<T>(defaultValue: T): [T, (v: T) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  useEffect(() => setValue(defaultValue), [defaultValue]);

  return [value, setValue, value !== defaultValue];
}

function useInputHtmlEditable(defaultValue: string): [string, (v: any) => void, boolean] {
  const [value, setValue, wasChanged] = useEditable<string>(defaultValue);
  return [value, e => setValue(e.target.value), wasChanged]
}

const InputUtils = {
  useEditable,
  useInputHtmlEditable
}

export { InputUtils }
