# BI 渲染器

暴露的方式是 react 组件图表框架选用 echarts，ant/g2 的 bug 还是比较多

props：

- layoutMode：页面选用的布局方式，默认 grid（后续开发 free 模式）
- config：页面的 config
  ```JSON
  {
    "width": 1920, // 若不设置，则默认容器100%
    "height": 1080,
    "background": "#ffffff",
    "padding": "16 | '16px 24px'",
    "rowGutter": 20,
    "colGutter": 20,
    "autofit": false, // 图表自适应宽高
    "theme": "dark", // themeconfig
    "colNum": 3, // page采用网格布局，最大不超过4列
    "children": [
      {
        "key": "chart1",
        "width": 480, // 自由模式下生效
        "height": 360,
        "col": 1,
        "row": 1,
        "colSpan": 12, // 优先级低于width
        "type": "bar",
        "autofit": true, // 自动适应容器大小
        "options": echarsOptions
      },
      {
        "key": "chart1",
        "width": 480,
        "height": 360, // 优先级高于rowHeihgt,
        "colSpan": 12, // 优先级低于width
        "type": "line",
        "col": 2,
        "row": 1,
        "options": { // chartOptions
          "type": "line",
          "data": [
            { name: "张三", age: 18 },
          ],
          "encode": {
            "x": "name",
            "y": "age"
          }
        }
      },
      {
        "key": "custom",
        "width": 480,
        "height": 360, // 优先级高于rowHeihgt,
        "colSpan": 12, // 优先级低于width
        "col": 3,
        "row": 1,
        "type": "custom1",
        "props": any, // 自定义组件的props
      }
    ]
  }
  ```
- data
