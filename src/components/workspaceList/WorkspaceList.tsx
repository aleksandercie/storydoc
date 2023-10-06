import './WorkspaceList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { addList, reorder, selectState } from '../../store/slices';
import { Plus } from '../../assets/icons';
import { AppDispatch } from '../../store/store';
import { WorkspaceListItem } from '../workspaceListItem';
import { generateId } from '../../helpers/generateId';
import { TaskInterface } from '../../store/types';
import { Editor } from '../editor';
import { createPortal } from 'react-dom';
import { WorkspaceTask } from '../workspaceTask';

export const WorkspaceList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [newList, setNewList] = useState(false);
  const [value, setValue] = useState('');
  const { board } = useSelector(selectState);
  const filtredLists = board.lists?.filter(
    ({ workspace }) => workspace === board.activeWorkspace
  );

  const editList = () => setNewList(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const addNewList = useCallback(() => {
    const id = generateId();
    dispatch(addList({ workspace: board.activeWorkspace, id, name: value }));
    setValue('');
    setNewList(false);
  }, [board.activeWorkspace, dispatch, value]);
  const resetAddList = () => {
    setValue('');
    setNewList(false);
  };

  useEffect(() => {
    setNewList(false);
  }, [board.activeWorkspace]);

  const [activeList, setActiveList] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<TaskInterface | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Group') {
      setActiveList(event.active.data.current.name);
      return;
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      setActiveList(null);
      setActiveTask(null);

      const { active, over } = e;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) return;

      const isActiveGroup = active.data.current?.type === 'Group';
      if (!isActiveGroup) return;

      const oldIndex = board.lists.findIndex((list) => list.name === activeId);
      const newIndex = board.lists.findIndex((list) => list.name === overId);
      const newOrder = arrayMove(board.lists, oldIndex, newIndex);
      dispatch(reorder({ ...board, lists: newOrder }));
    },
    [board, dispatch]
  );

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) return;

      const isActiveTask = active.data.current?.type === 'Task';
      const isOverTask = over.data.current?.type === 'Task';

      if (!isActiveTask) return;

      if (isActiveTask && isOverTask) {
        const tasks = JSON.parse(
          JSON.stringify(board.tasks)
        ) as TaskInterface[];

        const oldIndex = tasks.findIndex((task) => task.id === activeId);
        const newIndex = tasks.findIndex((task) => task.id === overId);
        tasks[oldIndex].list = tasks[newIndex].list;
        const newOrder = arrayMove(tasks, oldIndex, newIndex);
        dispatch(reorder({ ...board, tasks: newOrder }));
      }

      const isOverGroup = over.data.current?.type === 'Group';

      if (isActiveTask && isOverGroup) {
        const tasks = JSON.parse(
          JSON.stringify(board.tasks)
        ) as TaskInterface[];
        const oldIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[oldIndex].list = overId as string;
        const newOrder = arrayMove(tasks, oldIndex, oldIndex);
        dispatch(reorder({ ...board, tasks: newOrder }));
      }
    },
    [board, dispatch]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const [scroll, setScroll] = useState(0);
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollLeft = target.scrollLeft;
    setScroll(scrollLeft);
  };

  const blurWidth = useMemo(
    () => `${(28 * scroll) / 10 < 102 ? (40 * scroll) / 10 : 105 + scroll}px`,
    [scroll]
  );

  return (
    <div className='list' onScroll={handleScroll}>
      <div
        className='list-blur'
        style={{
          width: blurWidth,
        }}
      ></div>
      {filtredLists.length > 0 ? (
        <DndContext
          collisionDetection={closestCenter}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          sensors={sensors}
        >
          <SortableContext
            items={filtredLists.map((list) => ({ id: list.name }))}
            strategy={horizontalListSortingStrategy}
          >
            {filtredLists?.map(({ name, id }) => (
              <WorkspaceListItem name={name} key={id} />
            ))}
          </SortableContext>
          {createPortal(
            <DragOverlay>
              {activeList && <WorkspaceListItem name={activeList} />}
              {activeTask && (
                <WorkspaceTask
                  list={activeTask.list}
                  checked={activeTask.checked}
                  subtasks={[]}
                  workspace={activeTask.workspace}
                  name={activeTask.name}
                  id={activeTask.id}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      ) : null}
      {newList ? (
        <div className={newList ? 'list-new edit wrapper-edit' : 'list-new'}>
          <Editor
            edit={newList}
            name=''
            value={value}
            handleChange={handleChange}
            save={addNewList}
            reset={resetAddList}
            placeholder='Title of the new list...'
            buttonName='Add list'
          />
        </div>
      ) : (
        <div className='list-container'>
          <button
            type='button'
            className='button-plus button'
            onClick={editList}
          >
            <Plus />
            <span className='name list-add'>Add another list</span>
          </button>
        </div>
      )}
    </div>
  );
};
