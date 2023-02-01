在React中定义因变量时需要显式指明“因变量依赖的自变量”（即useMemo的第二个参数），而在Vue、Mobx中并不需要显式指明上述参数：
```js
//在React中定义无副作用因变量
const y = useMemo(()=>x*2+1,[x])
//在Vue中定义无副作用变量
const y = computed(()=>x.value*2+1)
//在Mobx中定义无副作用因变量
const y = computed(()=>x.data*2+1)
```

在Vue和Mobx中使用的“能自动追踪依赖的技术”被称为**细粒度更新（Fine-Grained Reactivity）**，它同时也是许多前端框架建立“自变量变化到UI变化”的底层原理

这个仓库将使用70余行代码，使用React API的名称，实现一个“细粒度更新”的简单示例