import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import MainContent from './components/renderer/content';
import Layout from './layout';
import { HeaderContent } from './layout/headerContent';
import SideContent from './layout/sideContent';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout sidebarContent={<SideContent />} headerContent={<HeaderContent />}>
        <MainContent />
      </Layout>
    </DndProvider>
  );
}

export default App;
