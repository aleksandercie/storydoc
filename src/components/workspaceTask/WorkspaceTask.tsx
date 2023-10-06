import './WorkspaceTask.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AppDispatch } from '../../store/store';
import { Editor } from '../editor';
import { useDispatch } from 'react-redux';
import { checkedTask, editTask, removeTask } from '../../store/slices';
import { TaskInterface } from '../../store/types';
import { WorkspaceSubtasks } from '../workspaceSubtasks';

export const WorkspaceTask = ({
  name,
  list,
  checked,
  id,
  subtasks,
}: TaskInterface) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'Task',
      task: {
        name,
        list,
        checked,
        id,
        subtasks,
      },
    },
  });
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState('');
  const [editSubtask, setEditSubtask] = useState(false);

  const remove = useCallback(() => dispatch(removeTask(id)), [dispatch, id]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const handleEdit = () => setEdit(true);
  const saveEdit = useCallback(() => {
    setEdit(false);
    setValue('');
    dispatch(
      editTask({
        id,
        newName: value,
        listName: list,
      })
    );
  }, [dispatch, id, list, value]);
  const resetEdit = () => {
    setEdit(false);
    setValue('');
  };
  const handleChecked = useCallback(
    () => dispatch(checkedTask({ id, checked: !checked })),
    [checked, dispatch, id]
  );
  const showSubtask = () => setEditSubtask((prev) => !prev);

  const subtasksInfo = useMemo(
    () =>
      subtasks.length > 0
        ? `${subtasks.filter(({ checked }) => checked === true).length}/${
            subtasks.length
          }`
        : null,
    [subtasks]
  );

  useEffect(() => {
    setEditSubtask(false);
    setEdit(false);
    setValue('');
  }, [isDragging]);

  return (
    <div
      className='task'
      key={id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? '0.3' : '1',
      }}
    >
      <div
        className={`${
          edit ? 'task-container box wrapper-edit' : 'task-container box'
        } ${editSubtask !== undefined && 'arrow'}`}
      >
        <Editor
          edit={edit}
          name={name}
          value={value}
          handleEdit={handleEdit}
          handleChange={handleChange}
          handleChecked={handleChecked}
          remove={remove}
          save={saveEdit}
          reset={resetEdit}
          placeholder={edit ? 'Change name card' : 'Title of the new card...'}
          checked={checked}
          buttonName='Save changes'
          isSubtask={editSubtask}
          showSubtask={showSubtask}
          subtasksInfo={subtasksInfo}
        />
      </div>
      {editSubtask ? (
        <WorkspaceSubtasks subtasks={subtasks} taskId={id} />
      ) : null}
    </div>
  );
};
