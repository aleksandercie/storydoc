import './WorkspaceAdd.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Check, Plus } from '../../assets/icons';
import {
  addWorkspace,
  reorder,
  selectState,
  setActiveWorkspace,
} from '../../store/slices';
import { AppDispatch } from '../../store/store';
import { WorkspaceCard } from './WorkspaceCard';
import { generateId } from '../../helpers/generateId';
import { createPortal } from 'react-dom';
import { NameInterface } from '../../store/types';

export const WorkspaceAdd = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState('');
  const [newWorkspace, setNewWorkSpace] = useState(false);
  const { board } = useSelector(selectState);

  const handleNewWorkspace = () => {
    setNewWorkSpace(true);
    dispatch(setActiveWorkspace(''));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const addNewWorkspace = (name: string) => () => {
    const id = generateId();
    setValue('');
    setNewWorkSpace(false);
    dispatch(setActiveWorkspace(name));
    dispatch(addWorkspace({ name, id }));
  };

  const [activeSpace, setActiveSpace] = useState<NameInterface | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Workspace') {
      setActiveSpace(event.active.data.current.workspace);
      return;
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIndex = board.workspaces.findIndex(
        (workspace) => workspace.id === active.id
      );
      const newIndex = board.workspaces.findIndex(
        (workspace) => workspace.id === over.id
      );
      const newOrder = arrayMove(board.workspaces, oldIndex, newIndex);
      dispatch(reorder({ ...board, workspaces: newOrder }));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const displayValue = useMemo(
    () => (value.length > 0 ? value[0].toUpperCase() : null),
    [value]
  );

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        sensors={sensors}
      >
        <SortableContext
          items={board.workspaces.map((workspace) => ({ id: workspace.name }))}
          strategy={verticalListSortingStrategy}
        >
          {board.workspaces?.map(({ name, id }) => (
            <WorkspaceCard name={name} key={id} id={id} isEdit={newWorkspace} />
          ))}
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeSpace && (
              <WorkspaceCard
                name={activeSpace.name}
                key={activeSpace.id}
                id={activeSpace.id}
                isEdit={newWorkspace}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      {newWorkspace ? (
        <>
          <div className={`workspace ${newWorkspace ? 'active' : ''}`}>
            <div className='workspace-icon'>
              <span className='name'>{displayValue}</span>
            </div>
            <input
              type='text'
              className='workspace-input input name'
              placeholder='Workspace name'
              onChange={handleChange}
              value={value}
            />
          </div>
          <button
            type='button'
            className='workspace-save name button'
            onClick={addNewWorkspace(value)}
            disabled={value === ''}
          >
            <Check />
            <span>Save new workspace</span>
          </button>
        </>
      ) : (
        <button
          type='button'
          className='workspace-create button'
          onClick={handleNewWorkspace}
        >
          <Plus />
          <p className='create-name name'>Create workspace</p>
        </button>
      )}
    </>
  );
};
