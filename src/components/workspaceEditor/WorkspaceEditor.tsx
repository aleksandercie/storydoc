import './WorkspaceEditor.scss';
import React from 'react';
import { Edit, Trash } from '../../assets/icons';
import { Editor } from '../editor';

interface WorkspaceEditorProps {
  edit: boolean;
  name: string;
  value: string;
  handleEdit: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setName: () => void;
  remove: () => void;
  save: () => void;
  reset: () => void;
  placeholder: string;
  icon: JSX.Element;
}

export const WorkspaceEditor = React.memo(
  ({
    edit,
    name,
    icon,
    handleEdit,
    value,
    handleChange,
    setName,
    remove,
    save,
    reset,
    placeholder,
  }: WorkspaceEditorProps) => (
    <div className='input'>
      {edit ? (
        <div className={edit ? 'input-new edit wrapper-edit' : 'input-new'}>
          <Editor
            edit={edit}
            name=''
            value={value}
            handleChange={handleChange}
            save={save}
            reset={reset}
            placeholder={placeholder}
            buttonName='Change name'
          />
        </div>
      ) : (
        <button type='button' className='input-button' onClick={setName}>
          {icon}
          <p className='input-name name'>{name}</p>
        </button>
      )}
      <div className='input-icons'>
        {edit ? null : (
          <>
            <button className='input-button' type='button' onClick={handleEdit}>
              <Edit />
            </button>
            <button className='input-button' type='button' onClick={remove}>
              <Trash />
            </button>
          </>
        )}
      </div>
    </div>
  )
);
