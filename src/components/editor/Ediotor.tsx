import './Ediotor.scss';
import React from 'react';
import { ArrowLeft, Edit, Trash, X } from '../../assets/icons';
import { Checkbox } from 'antd';

interface EditorProps {
  edit: boolean;
  name: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  save: () => void;
  reset: () => void;
  placeholder: string;
  remove?: () => void;
  handleEdit?: () => void;
  setName?: () => void;
  handleChecked?: () => void;
  checked?: boolean;
  taskChecked?: string;
  buttonName?: string;
  isSubtask?: boolean;
  showSubtask?: () => void;
  subtasksInfo?: string | null;
}

export const Editor = React.memo(
  ({
    edit,
    name,
    checked,
    handleEdit,
    value,
    handleChange,
    remove,
    save,
    reset,
    placeholder,
    handleChecked,
    taskChecked,
    buttonName,
    isSubtask,
    showSubtask,
    subtasksInfo,
  }: EditorProps) => (
    <div className={edit ? 'editor edit' : 'editor'}>
      {edit ? (
        <div className={edit ? 'editor-container edit' : 'editor-container'}>
          <div className='editor-box'>
            {checked !== undefined && handleChecked ? (
              <Checkbox
                checked={checked}
                onChange={handleChecked}
                className='editor-checkbox'
              />
            ) : null}
            <input
              type='text'
              className='editor-field name edit'
              placeholder={placeholder}
              onChange={handleChange}
              value={value}
            />
          </div>
          <div className='editor-handle'>
            <button
              type='button'
              onClick={save}
              className='editor-save name'
              disabled={value.length === 0}
            >
              {buttonName}
            </button>
            <button type='button' onClick={reset} className='editor-decline'>
              <X />
            </button>
          </div>
        </div>
      ) : (
        <div className='editor-panel'>
          {isSubtask !== undefined && showSubtask ? (
            <button
              type='button'
              onClick={showSubtask}
              className={`${
                isSubtask ? 'editor-dropdown open' : 'editor-dropdown'
              } ${subtasksInfo && 'show'}`}
            >
              <ArrowLeft />
            </button>
          ) : null}
          {checked !== undefined ? (
            <Checkbox checked={checked} onChange={handleChecked} />
          ) : null}
          <p className={`editor-name name ${taskChecked && 'bold'}`}>{name}</p>
        </div>
      )}
      {taskChecked && !edit ? (
        <p className='editor-tasks name'>{taskChecked}</p>
      ) : null}
      {subtasksInfo && !edit && (
        <p className='editor-tasks name'>{subtasksInfo}</p>
      )}
      <div className='editor-icons'>
        {edit ? null : (
          <>
            <button
              className='editor-button'
              type='button'
              onClick={handleEdit}
            >
              <Edit />
            </button>
            <button className='editor-button' type='button' onClick={remove}>
              <Trash />
            </button>
          </>
        )}
      </div>
    </div>
  )
);
