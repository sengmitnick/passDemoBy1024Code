# DaoPaaS 示例 DEMO

欢迎来到 DaoPaaS 示例 DEMO，该代码空间是 DaoPaaS 的一个简单使用示例。

温馨提示

- SDK 接口文档 [api 地址](https://www.apifox.cn/apidoc/shared-c0c0ebad-15b3-4605-896e-e39879fe6e47/doc-952073)
- 真实接口请求过程中，请按照接口文档的要求携带头信息。
- 本案例使用简单的js+HTML，其他项目请参考逻辑。
- 请用户自行优化代码逻辑并做合适的错误处理。

## 开发环境搭建

```sh
npx -y pnpm i
npm run build
npm run start
```

启动后，访问 `http://127.0.0.1:8080` 即可。

## 目录结构

```
.
├── bundle.js       通过 browserify 打包后的文件
├── http.js         pass的一些API
├── index.html      主入口HTML
├── main.js         主入口HTML
├── messages.js     pass提供的Messages枚举
└── ...             其他无关文件
```

## 大致说明

主要是`main.js`的`main`函数和`initDaoPasS`函数

`main`初始化了模版列表的数据，`initDaoPasS`则通过`API拿票`然后创建一个新的代码空间～

## TODO

- 同一个代码空间协作