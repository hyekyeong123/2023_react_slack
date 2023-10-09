import { Dispatch, SetStateAction, useCallback, useState, ChangeEvent } from 'react';

type ReturnTypes<T> = [
  T,
  (e: ChangeEvent<HTMLInputElement>) => void,
  Dispatch<SetStateAction<T>>
];

const useInput = <T,>(_initialData: T): ReturnTypes<T> => {
  
  const [value, setValue] = useState(_initialData);
  const handlerFunc = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);
  return [value, handlerFunc, setValue];
};

export default useInput;
