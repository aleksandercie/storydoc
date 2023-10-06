export type SubtaskType = Omit<
  TaskInterface,
  'list' | 'subtasks' | 'workspace'
>;
export interface TaskInterface extends ListInterface {
  list: string;
  checked: boolean;
  subtasks: SubtaskType[];
}
export interface ListInterface extends NameInterface {
  workspace: string;
}

export interface NameInterface {
  name: string;
  id: string;
}

export interface BoardInterface {
  workspaces: NameInterface[];
  lists: ListInterface[];
  tasks: TaskInterface[];
  activeWorkspace: string;
}
