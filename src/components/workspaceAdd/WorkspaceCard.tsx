import './WorkspaceAdd.scss';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AppDispatch } from '../../store/store';
import {
  removeWorkspace,
  editWorkspace,
  setActiveWorkspace,
  selectState,
} from '../../store/slices';
import { WorkspaceEditor } from '../workspaceEditor';
import { NameInterface } from '../../store/types';

interface WorkspaceCardProps extends NameInterface {
  isEdit: boolean;
}

export const WorkspaceCard = ({ name, id, isEdit }: WorkspaceCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    board: { activeWorkspace },
  } = useSelector(selectState);
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
      type: 'Workspace',
      workspace: { name, id },
    },
  });
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState('');

  const remove = () => dispatch(removeWorkspace(name));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const handleEdit = useCallback(() => {
    if (!isEdit) setEdit(true);
  }, [isEdit]);
  const saveEdit = (name: string, value: string) => () => {
    setEdit(false);
    setValue('');
    dispatch(setActiveWorkspace(value));
    dispatch(editWorkspace({ oldName: name, newName: value }));
  };
  const setWorkspace = useCallback(
    (name: string) => () => {
      if (!isEdit) dispatch(setActiveWorkspace(name));
    },
    [dispatch, isEdit]
  );
  const resetEdit = () => {
    setEdit(false);
    setValue('');
  };

  const icon = useMemo(
    () => (
      <div className='workspace-icon'>
        <span className='name'>
          {edit
            ? value.length > 0
              ? value[0].toUpperCase()
              : null
            : name[0].toUpperCase()}
        </span>
      </div>
    ),
    [edit, name, value]
  );

  return (
    <div
      className={`workspace ${activeWorkspace === name ? 'active' : ''} ${
        edit ? 'edit' : ''
      }`}
      key={name}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? '0.3' : '1',
      }}
    >
      <WorkspaceEditor
        edit={edit}
        name={name}
        value={value}
        handleEdit={handleEdit}
        handleChange={handleChange}
        remove={remove}
        setName={setWorkspace(name)}
        save={saveEdit(name, value)}
        reset={resetEdit}
        placeholder='Change name workspace'
        icon={icon}
      />
    </div>
  );
};
