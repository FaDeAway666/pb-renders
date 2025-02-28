import { Renderer } from '@pb-renders/bi-render';
import { Button, message, Modal, Space } from 'antd';
import { useState } from 'react';

import { useRendererStore } from '@/store';
import './headerContent.less';
import { deepToString } from '@/utils/json';

const testFetch = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 2000);
  });

export const HeaderContent = () => {
  const getConfig = useRendererStore((state) => state.getConfig);
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

  const dataFetch = {
    bar: () => {
      return testFetch().then(() => ({
        sales: {
          tshirt: 10,
          hoodie: 20,
          sweather: 40,
          skirt: 30,
        },
        imports: {
          tshirt: 20,
          hoodie: 30,
          sweather: 50,
          skirt: 30,
        },
      }));
    },
  };

  const dataLabelMap = {
    tshirt: 'T恤',
    hoodie: '卫衣',
    sweather: '毛衣',
    skirt: '裙子',
    sales: '销量',
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
        <Renderer
          mode="grid"
          config={getConfig()}
          data={dataFetch}
          dataLabelMap={dataLabelMap}
        />
      </Modal>
    </>
  );
};
