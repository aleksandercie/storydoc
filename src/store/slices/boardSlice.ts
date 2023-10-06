import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BoardInterface,
  ListInterface,
  NameInterface,
  SubtaskType,
  TaskInterface,
} from '../types';

const initialState: BoardInterface | Record<string, never> = {
  workspaces: [],
  lists: [],
  tasks: [],
  activeWorkspace: '',
};
export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setActiveWorkspace: (state, action: PayloadAction<string>) => {
      state.activeWorkspace = action.payload;
    },
    addWorkspace: (state, action: PayloadAction<NameInterface>) => {
      const { id, name } = action.payload;
      const isNameExist = state.workspaces.some(
        (workspace) => workspace.name === name
      );

      if (!isNameExist) {
        state.workspaces.push({
          name,
          id,
        });
      } else {
        window.alert(`Workspace with name "${name}" already exists.`);
      }
    },
    removeWorkspace: (state, action: PayloadAction<string>) => {
      const workspaceName = action.payload;
      state.workspaces = state.workspaces.filter(
        ({ name }) => name !== workspaceName
      );
      state.lists = state.lists.filter(
        ({ workspace }) => workspace !== workspaceName
      );
      state.tasks = state.tasks.filter(
        ({ workspace }) => workspace !== workspaceName
      );
    },
    editWorkspace: (
      state,
      action: PayloadAction<{ oldName: string; newName: string }>
    ) => {
      const { oldName, newName } = action.payload;
      const isNameExist = state.workspaces.some(
        (workspace) => workspace.name === newName
      );

      if (!isNameExist) {
        state.workspaces = state.workspaces.map((workspace) => {
          if (workspace.name === oldName) {
            return { ...workspace, name: newName };
          }
          return workspace;
        });

        state.lists = state.lists.map((list) => {
          if (list.workspace === oldName) {
            return { ...list, workspace: newName };
          }
          return list;
        });

        state.tasks = state.tasks.map((task) => {
          if (task.workspace === oldName) {
            return { ...task, workspace: newName };
          }
          return task;
        });
      } else {
        window.alert(`Workspace with name "${newName}" already exists.`);
      }
    },
    addList: (state, action: PayloadAction<ListInterface>) => {
      const { id, name, workspace } = action.payload;
      const isNameExist = state.lists.some(
        (list) => list.name === name && list.workspace === workspace
      );

      if (!isNameExist) {
        state.lists.push({
          name,
          id,
          workspace,
        });
      } else {
        window.alert(
          `List with name "${name}" already exists in the workspace "${workspace}".`
        );
      }
    },
    removeList: (state, action: PayloadAction<string>) => {
      const listName = action.payload;
      state.lists = state.lists.filter(({ name }) => name !== listName);
      state.tasks = state.tasks.filter(({ list }) => list !== listName);
    },
    editList: (
      state,
      action: PayloadAction<{ oldName: string; newName: string }>
    ) => {
      const { oldName, newName } = action.payload;
      const isNameExist = state.lists.some((list) => list.name === newName);

      if (!isNameExist) {
        state.lists = state.lists.map((list) => {
          if (list.name === oldName) {
            return { ...list, name: newName };
          }
          return list;
        });

        state.tasks = state.tasks.map((task) => {
          if (task.list === oldName) {
            return { ...task, list: newName };
          }
          return task;
        });
      } else {
        window.alert(`List with name "${newName}" already exists.`);
      }
    },
    addTask: (state, action: PayloadAction<TaskInterface>) => {
      const { id, name, subtasks, list, workspace, checked } = action.payload;
      const isTaskNameExistInList = state.tasks.some(
        (task) => task.name === name && task.list === list
      );

      if (!isTaskNameExistInList) {
        state.tasks.push({
          workspace,
          name,
          id,
          subtasks,
          list,
          checked,
        });
      } else {
        window.alert(
          `A task with the name "${name}" already exists in this list.`
        );
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(({ id }) => id !== action.payload);
    },
    editTask: (
      state,
      action: PayloadAction<{
        id: string;
        newName: string;
        listName: string;
      }>
    ) => {
      const { id, newName, listName } = action.payload;
      const isNameExistInList = state.tasks.some(
        (task) => task.name === newName && task.list === listName
      );

      if (!isNameExistInList) {
        state.tasks = state.tasks.map((task) => {
          if (task.id === id && task.list === listName) {
            return { ...task, name: newName };
          }
          return task;
        });
      } else {
        window.alert(
          `A task with the name "${newName}" already exists in the same list.`
        );
      }
    },
    checkedTask: (
      state,
      action: PayloadAction<{ id: string; checked: boolean }>
    ) => {
      const { id, checked } = action.payload;
      state.tasks = state.tasks.map((task) => {
        if (task.id === id) {
          return { ...task, checked };
        }
        return task;
      });
    },
    reorder: (_, action: PayloadAction<BoardInterface>) => {
      return action.payload;
    },
    addSubtask: (
      state,
      action: PayloadAction<{ taskId: string; subtask: SubtaskType }>
    ) => {
      const { taskId, subtask } = action.payload;
      const taskIndex = state.tasks.findIndex(({ id }) => id === taskId);
      console.log(taskId);

      if (taskIndex !== -1) {
        const isSubtaskExist = state.tasks[taskIndex].subtasks.some(
          (existingSubtask) => existingSubtask.name === subtask.name
        );

        if (!isSubtaskExist) {
          state.tasks[taskIndex].subtasks.push(subtask);
        } else {
          window.alert(
            `Subtask with name "${subtask.name}" already exists in this task.`
          );
        }
      }
    },
    removeSubtask: (
      state,
      action: PayloadAction<{ taskId: string; subtaskName: string }>
    ) => {
      const { taskId, subtaskName } = action.payload;
      const taskIndex = state.tasks.findIndex(({ id }) => id === taskId);

      if (taskIndex !== -1) {
        state.tasks[taskIndex].subtasks = state.tasks[
          taskIndex
        ].subtasks.filter(({ name }) => name !== subtaskName);
      }
    },
    editSubtask: (
      state,
      action: PayloadAction<{
        taskId: string;
        subtaskName: string;
        newName: string;
      }>
    ) => {
      const { taskId, subtaskName, newName } = action.payload;
      const taskIndex = state.tasks.findIndex(({ id }) => id === taskId);

      if (taskIndex !== -1) {
        const subtaskIndex = state.tasks[taskIndex].subtasks.findIndex(
          ({ name }) => name === subtaskName
        );

        if (subtaskIndex !== -1) {
          const isSubtaskExist = state.tasks[taskIndex].subtasks.some(
            (existingSubtask) => existingSubtask.name === newName
          );

          if (!isSubtaskExist) {
            state.tasks[taskIndex].subtasks[subtaskIndex].name = newName;
          } else {
            window.alert(
              `Subtask with name "${newName}" already exists in this task.`
            );
          }
        }
      }
    },
    checkedSubtask: (
      state,
      action: PayloadAction<{
        taskId: string;
        subtaskName: string;
        checked: boolean;
      }>
    ) => {
      const { taskId, subtaskName, checked } = action.payload;
      const taskIndex = state.tasks.findIndex(({ id }) => id === taskId);

      if (taskIndex !== -1) {
        const subtaskIndex = state.tasks[taskIndex].subtasks.findIndex(
          ({ name }) => name === subtaskName
        );

        if (subtaskIndex !== -1) {
          state.tasks[taskIndex].subtasks[subtaskIndex].checked = checked;
        }
      }
    },
  },
});

export const selectState = (state: { board: BoardInterface }) => state;

export const {
  addWorkspace,
  removeWorkspace,
  editWorkspace,
  addList,
  removeList,
  editList,
  addTask,
  removeTask,
  editTask,
  reorder,
  setActiveWorkspace,
  checkedTask,
  addSubtask,
  removeSubtask,
  editSubtask,
  checkedSubtask,
} = boardSlice.actions;
