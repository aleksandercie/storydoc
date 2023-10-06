import { useCallback, useState } from 'react';
import { Plus } from '../../assets/icons';
import { SubtaskType } from '../../store/types';
import { Editor } from '../editor';
import './WorkspaceSubtasks.scss';
import { generateId } from '../../helpers/generateId';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { addSubtask } from '../../store/slices';
import { WorkspaceSubtask } from '../workspaceSubtask';

interface WorkspaceSubtasksInterface {
  subtasks: SubtaskType[];
  taskId: string;
}

export const WorkspaceSubtasks = ({
  subtasks,
  taskId,
}: WorkspaceSubtasksInterface) => {
  const dispatch = useDispatch<AppDispatch>();
  const [subtaskAdd, setSubtaskAdd] = useState(false);
  const [valueSubtask, setValueSubtask] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const newSubtask = () => setSubtaskAdd(true);
  const handleChecked = () => setIsChecked((prev) => !prev);
  const handleChangeTask = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValueSubtask(e.target.value);
  const resetAddSubtask = () => {
    setValueSubtask('');
    setSubtaskAdd(false);
  };
  const addNewSubtask = useCallback(() => {
    const id = generateId();
    setValueSubtask('');
    setSubtaskAdd(false);
    setIsChecked(false);
    dispatch(
      addSubtask({
        taskId,
        subtask: {
          id,
          checked: isChecked,
          name: valueSubtask,
        },
      })
    );
  }, [dispatch, isChecked, taskId, valueSubtask]);

  return (
    <div className='subtasks'>
      <div className='subtasks-items'>
        {subtasks.map(({ name, checked, id }) => (
          <WorkspaceSubtask
            name={name}
            key={id}
            checked={checked}
            id={id}
            taskId={taskId}
          />
        ))}
      </div>
      {subtaskAdd ? (
        <div
          className={
            subtaskAdd ? 'subtasks-item wrapper-edit' : 'subtasks-item'
          }
        >
          <Editor
            edit={subtaskAdd}
            name=''
            value={valueSubtask}
            handleChange={handleChangeTask}
            save={addNewSubtask}
            reset={resetAddSubtask}
            placeholder='New subtask...'
            buttonName='Add subtask'
            checked={isChecked}
            handleChecked={handleChecked}
          />
        </div>
      ) : null}
      <div className='subtasks-button'>
        <button
          type='button'
          className='button button-plus'
          onClick={newSubtask}
        >
          <Plus />
          <span className='name'>Add a subtask</span>
        </button>
      </div>
    </div>
  );
};
