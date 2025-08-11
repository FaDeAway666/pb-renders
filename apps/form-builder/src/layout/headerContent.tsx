import { Button, message, Modal, Space } from 'antd';
// import { Renderer } from 'pb-bi-render';
import { useState } from 'react';

import { useRendererStore } from '@/store';
import './headerContent.less';
import { deepToString } from '@/utils/json';

export const HeaderContent = () => {
  const getConfig = useRendererStore((state) => state.getSchemas);
  const [visible, setVisible] = useState(false);

  const exportConfig = () => {
    const curConfig = getConfig();
    const configStr = deepToString(curConfig);

    // 输出到剪切板
    navigator.clipboard.writeText(configStr).then(() => {
      console.log('Config copied to clipboard');
      message.success('已复制到剪切板');
    });
  };

  return (
    <>
      <div className="header-container">
        <Space>
          <Button type="primary" onClick={() => setVisible(true)}>
            预览
          </Button>
          <Button type="primary" onClick={exportConfig}>
            导出
          </Button>
        </Space>
      </div>
      <Modal
        wrapClassName="preview-wrapper"
        width={'100vw'}
        height={'1000'}
        title="预览"
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        {/* <Renderer
          mode="grid"
          config={getConfig()}
          data={dataFetch}
          dataLabelMap={dataLabelMap}
        /> */}
      </Modal>
    </>
  );
};
