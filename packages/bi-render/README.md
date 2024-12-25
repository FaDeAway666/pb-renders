# BI 渲染器

暴露的方式是 react 组件

props：

- autofit: 是否自适应容器大小，如果为 true，优先级高于 config 中关于页面的配置
- config：页面的 config
  ```JSON
  {
    "width": 1920, // 若不设置，则默认容器100%
    "height": 1080,
    "background": "#ffffff",
    "padding": "16 | '16px 24px'",
    "rowGutter": 20,
    "colGutter": 20,
    "theme": "dark", // themeconfig
    "colNum": 3, // page采用网格布局，最大不超过4列
    "children": [
      {
        {
          "key": "chart1",
          "width": 480,
          "height": 360,
          "colSpan": 12, // 优先级低于width
          "options": { // chartOptions
            "type": "interval",
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
          "key": "chart1",
          "width": 480,
          "height": 360, // 优先级高于rowHeihgt,
          "colSpan": 12, // 优先级低于width
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
        }
      }
    ]
  }
  ```
- extraConfig: 针对每个图表进行的额外配置，以函数的形式传入
  ```js
  const extraConfig = {
    // chart1为具体图表的key
    'chart1': (chart) => {
      // chart: chart实例
    }，
    'chart2': (chart) => {
      // chart: chart实例
    }
  ```
- data
