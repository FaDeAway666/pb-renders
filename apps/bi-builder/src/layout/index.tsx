import { Layout } from 'antd';
import { useState } from 'react';
import './index.less';

interface LayoutProps {
  sidebarContent: React.ReactNode;
  children?: React.ReactNode;
}

const { Sider, Content, Header } = Layout;
const LayoutComp: React.FC<LayoutProps> = (props: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { sidebarContent, children } = props;
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={320}
        collapsed={collapsed}
        collapsible
        onCollapse={(value) => setCollapsed(value)}
      >
        {sidebarContent}
      </Sider>
      <Layout>
        <Header />
        <Content className="layout-content">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComp;
