import './WorkspacesSidebar.scss';
import { UserProfile } from '../userProfile';
import { WorkspaceSettings } from '../workspaceSettings';
import { WorkspacesNav } from '../workspacesNav';
import { WorkspaceAdd } from '../workspaceAdd';

export const WorkspacesSidebar = () => (
  <div className='workspaces'>
    <div className='workspaces-header'>
      <WorkspaceAdd />
    </div>
    <div className='workspaces-main'>
      <WorkspacesNav />
    </div>
    <div className='workspaces-footer'>
      <UserProfile />
      <WorkspaceSettings />
    </div>
  </div>
);
