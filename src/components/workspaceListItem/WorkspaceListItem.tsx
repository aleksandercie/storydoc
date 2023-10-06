import './WorkspaceListItem.scss';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from '../../assets/icons';
import { AppDispatch } from '../../store/store';
import { removeList, editList, addTask, selectState } from '../../store/slices';
import { useCallback, useMemo, useState } from 'react';
import { WorkspaceTask } from '../workspaceTask';
import { generateId } from '../../helpers/generateId';
import { Editor } from '../editor';

export const WorkspaceListItem = ({ name }: { name: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { board } = useSelector(selectState);
  const filtredTasks = board.tasks.filter(
    ({ workspace, list }) =>
      workspace === board.activeWorkspace && list === name
  );
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: name,
    data: {
      type: 'Group',
      name,
    },
  });
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState('');
  const [taskAdd, setTaskAdd] = useState(false);
  const [valueTask, setValueTask] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const handleChangeTask = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValueTask(e.target.value);
  const handleEdit = () => setEdit(true);
  const saveEdit = useCallback(() => {
    setValue('');
    setEdit(false);
    dispatch(
      editList({
        oldName: name,
        newName: value,
      })
    );
  }, [dispatch, name, value]);
  const resetEdit = () => {
    setValue('');
    setEdit(false);
  };
  const removeGroup = useCallback(
    () => dispatch(removeList(name)),
    [dispatch, name]
  );
  const newTask = () => setTaskAdd(true);
  const [isChecked, setIsChecked] = useState(false);
  const handleChecked = () => setIsChecked((prev) => !prev);
  const addNewTask = useCallback(() => {
    const id = generateId();
    setValueTask('');
    setTaskAdd(false);
    dispatch(
      addTask({
        workspace: board.activeWorkspace,
        list: name,
        name: valueTask,
        subtasks: [],
        id,
        checked: isChecked,
      })
    );
    setIsChecked(false);
  }, [board.activeWorkspace, dispatch, isChecked, name, valueTask]);
  const resetAddTask = () => {
    setValueTask('');
    setTaskAdd(false);
  };

  const taskChecked = useMemo(
    () =>
      `${filtredTasks.filter(({ checked }) => checked === true).length}/${
        filtredTasks.length
      }`,
    [filtredTasks]
  );

  const displayTasks = useMemo(
    () =>
      filtredTasks.length > 0 ? (
        <SortableContext
          items={filtredTasks.map((item) => ({ id: item.name }))}
          strategy={rectSortingStrategy}
        >
          {filtredTasks.map(
            ({ name: taskName, id, checked, subtasks, workspace }) => (
              <WorkspaceTask
                workspace={workspace}
                key={id}
                id={id}
                name={taskName}
                list={name}
                checked={checked}
                subtasks={subtasks}
              />
            )
          )}
        </SortableContext>
      ) : null,
    [filtredTasks, name]
  );

  return (
    <div
      className='wrapper'
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? '0.3' : '1',
      }}
    >
      <div className={edit ? 'group wrapper-edit edit' : 'group'}>
        <div
          className={edit ? 'group-container edit' : 'group-container'}
          {...attributes}
          {...listeners}
        >
          <Editor
            edit={edit}
            name={name}
            value={value}
            handleEdit={handleEdit}
            handleChange={handleChange}
            remove={removeGroup}
            save={saveEdit}
            reset={resetEdit}
            placeholder='Change name list'
            taskChecked={taskChecked}
            buttonName='Save changes'
          />
        </div>
        {edit ? null : (
          <>
            <div className='group-tasks'>{displayTasks}</div>
            {taskAdd ? (
              <div
                className={taskAdd ? 'group-task wrapper-edit' : 'group-task'}
              >
                <Editor
                  edit={taskAdd}
                  name={name}
                  value={valueTask}
                  handleChange={handleChangeTask}
                  save={addNewTask}
                  reset={resetAddTask}
                  placeholder='Title of the new card...'
                  buttonName='Add card'
                  checked={isChecked}
                  handleChecked={handleChecked}
                />
              </div>
            ) : null}
            <button
              type='button'
              className='button button-plus'
              onClick={newTask}
            >
              <Plus />
              <span className='name'>Add a card</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
