import './app1.css'
import $ from 'jquery'
import Model from "./base/Model";
import View from "./base/View";
// 使用eventBus现实自定义事件的触发与监听，以下eventBus有个trigger函数可以触发自定义事件，on可以监听自定义事件
const eventBus = $({})
// 数据代码放入m对象
const m = new Model({n : localStorage.getItem('n')});
m.update = (data)=>{
  localStorage.setItem('n',data.n )
  Object.assign(m.data,data);
  eventBus.trigger('update')
}

// 其他代码放入c对象
const c = {
  // 选择元素
  init(el){
    // 视图代码放入v对象
    const v = new View({
      el:$(el),
      html : `
          <p id="numberText">{{n}}</p>
          <div class="btns">
            <button id="btn1"> +1 </button>
            <button id="btn2"> -1 </button>
            <button id="btn3"> *2 </button>
            <button id="btn4"> /2 </button>
          </div>`,
      render(){
        if(v.el.children.length !== 0) v.el.empty();
        $(v.html.replace('{{n}}',m.data.n)).prependTo(v.el);
      }})
    c.autoBindEvents();
    eventBus.on('update',()=>{
      v.render()
    })
  },
  events: {
    'click #btn1': 'add',
    'click #btn2': 'minus',
    'click #btn3': 'mul',
    'click #btn4': 'div',
  },
  add(){
    m.update({n: parseInt(m.data.n) + 1})
  },
  minus(){
    m.update({n: parseInt(m.data.n) - 1})
  },
  mul(){
    m.update({n: parseInt(m.data.n) * 2})
  },
  div(){
    m.update({n:  parseInt(m.data.n) / 2})
  },
  autoBindEvents(){
    for(let key in c.events) {
      let keyArr = key.split(' ');
      let eventName = keyArr[0];
      let eleName = keyArr[1];
      let funName = c.events[key]
      v.el.on(eventName,eleName,()=>{
        c[funName]();
      })
    }
  }
}
export default  c;
