[![Build Status](http://10.128.60.21:8088/iot_csot/iot-mgt/badges/master/build.svg)](http://10.128.60.21:8088/iot_csot/iot-mgt/pipelines)

# interface tool

## 编译脚手架
由于基础库内ES5的写法较多，因此在编译时不可以使用严格模式，同时不能对js进行uglify。使用babel进行编译，兼容IE11.

## 依赖下载
```javascript
npm install
```

### 运行开发环境
```javascript
npm run start
```

### 打包编译
打包后的文件在`interface`目录下面。
```
npm run build
```

### 注意
不要修改`package.json`内的打包目录，jenkins内是根据该目录自动打包。如果有修改，对应jenkins内的命令也需要修改。