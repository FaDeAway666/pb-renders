# BI 渲染器

基于 antd form，通过 schema 的方式快速完成表单搭建

支持的功能包括：

- 基础渲染，支持所有 ant formItem 组件
- 基础布局，包括标签排列方式，标签宽度，自定义表单项宽度等
- 表单校验，沿用 antd form 表单校验方式
- 表单联动
  - 简单联动：包括表单项显示隐藏、禁用等
  - 复杂联动：通过设置 watchHook，利用 form 实例完成复杂交互动作
- 自定义组件，基于 antd form 的自定义组件

props：

- formConfig: 基于 antd FormProps
- schema：配置项

```ts
const schemas = [
  {
    type: 'formItem',
    properties: {
      label: '用户名',
      category: 'input',
      name: 'username',
      props: {
        placeholder: '请输入',
      },
      // antd FormItem props类型, 默认值，rules等写这里
      itemProps: FormItemProps,
      disabled: false,
      hidden: false,
      depends: {
        // 监听其他字段的变化，value：其他字段的值，instance：form实例
        fieldA: (value, formInstance) => {
          return undefined;
        },
      },
    },
  },
  {
    type: 'row',
    properties: {
      colNum: 1,
    },
    // row容器中不能继续嵌套row容器
    children: [
      {
        type: 'formItem',
        properties: {
          category: 'input',
          name: 'username2',
          props: {
            placeholder: '请输入',
          },
          // antd FormItem props类型
          itemProps: FormItemProps,
        },
      },
    ],
  },
  {
    type: 'formList',
  },
  {
    type: 'custom',
    component: () => <div>123</div>,
    properties: {},
  },
];
```

- formEvents：基于 antd Form 透传的表单事件

```ts
  const events = {
    onValuesChange: (...args[]) => void;
    onFinish: (value) => void;
    ...
  }
```
