import React, { useCallback, useState } from 'react';
import { Editor } from '../editor';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { checkedSubtask, editSubtask, removeSubtask } from '../../store/slices';

interface WorkspaceSubtaskInterface {
  name: string;
  checked: boolean;
  id: string;
  taskId: string;
}

export const WorkspaceSubtask = ({
  name,
  checked,
  id,
  taskId,
}: WorkspaceSubtaskInterface) => {
  const dispatch = useDispatch<AppDispatch>();
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const handleEdit = () => setEdit(true);
  const saveEdit = useCallback(
    (name: string) => () => {
      dispatch(editSubtask({ taskId, subtaskName: name, newName: value }));
      setValue('');
      setEdit(false);
    },
    [dispatch, taskId, value]
  );
  const resetEdit = () => {
    setValue('');
    setEdit(false);
  };
  const remove = useCallback(
    (subtaskName: string) => () =>
      dispatch(removeSubtask({ taskId, subtaskName })),
    [dispatch, taskId]
  );

  const handleCheckedSubtask = useCallback(
    (name: string, checked: boolean) => () =>
      dispatch(
        checkedSubtask({
          taskId,
          subtaskName: name,
          checked: !checked,
        })
      ),
    [dispatch, taskId]
  );
  return (
    <div
      key={id}
      className={
        edit ? 'subtasks-container box wrapper-edit' : 'subtasks-container box'
      }
    >
      <Editor
        edit={edit}
        name={name}
        value={value}
        handleEdit={handleEdit}
        handleChange={handleChange}
        handleChecked={handleCheckedSubtask(name, checked)}
        remove={remove(name)}
        save={saveEdit(name)}
        reset={resetEdit}
        placeholder={'Change name subtask'}
        checked={checked}
        buttonName='Save changes'
      />
    </div>
  );
};
