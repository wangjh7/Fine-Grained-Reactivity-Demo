
type Execute = () => void
type Effect = {
  execute:Execute,
  deps:Set<Set<Effect>>,
}

const effectStack:Effect[] = []

function subscribe(effect:Effect,subs:Set<Effect>):void{
  //订阅关系建立
  subs.add(effect)
  //依赖关系建立
  effect.deps.add(subs)
}

function cleanup(effect:Effect):void{
  //从该effect订阅的所有state对应subs中移除改effect
  for(const subs of effect.deps){
    subs.delete(effect)
  }

  //将该effect依赖的所有state对应subs移除
  effect.deps.clear()
}

function useState<T>(value?:T):[()=>T|void,(nextValue:T)=>void]{
  //保存订阅该state变化的effect
  const subs:Set<Effect> = new Set()

  const getter = ():T|void => {
    //获取当前上下文的effect
    const effect = effectStack[effectStack.length - 1]
    if(effect){
      subscribe(effect,subs)
    }
    return value
  }
  const setter = (nextValue:T) => {
    value = nextValue

    //通知所有订阅该state变化的effect执行
    for(const effect of [...subs]){
      effect.execute()
    }
  }
  return [getter,setter]
}

function useEffect (callback:()=>void){
  const execute:Execute = () => {
    //重置依赖
    cleanup(effect)

    //将当前effect推入栈顶
    effectStack.push(effect)

    try{
      //执行回调
      callback()
    } finally {
      //effect出栈
      effectStack.pop()
    }
  }
  const effect:Effect = {
    execute,
    deps:new Set(),
  }
  execute()
}

function useMemo<Callback extends ()=>any>(callback:Callback):Callback|unknown{
  const [s,set] = useState()
  //首次执行callback，建立回调中state的订阅发布关系
  useEffect(()=>set(callback))
  return s
}