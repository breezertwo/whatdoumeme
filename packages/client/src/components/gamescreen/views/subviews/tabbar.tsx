import { Tabs } from '@base-ui/react/tabs';
import { STATES } from '../../../../interfaces/api';

interface TabBarProps {
  serverState: number;
}

export const TabBar = ({ serverState }: TabBarProps) => {
  if (serverState === STATES.WAITING) return null;

  return (
    <Tabs.List className="tab-list">
      <Tabs.Tab value={0} className="tab">
        Home
      </Tabs.Tab>
      <Tabs.Tab value={1} className="tab">
        Score
      </Tabs.Tab>
      <Tabs.Tab value={2} className="tab">
        Actions
      </Tabs.Tab>
    </Tabs.List>
  );
};
