    //缩放&拖拽
    scale(){
      /**
       * 缩放
       */
      var home = document.querySelector('.home');
      var body = document.querySelector('body');
      //缩放比
      var scal = 1;
      //鼠标坐标
      var x,y;
      //拖拽前点击坐标
      var clickX,clickY;
      //位移
      var moveX=0,moveY=0;
      //落地
      var lastX=0,lastY=0;
      //移动
      var translateX=0,translateY=0;

      function mousePosition(ev){ 
        ev = ev || window.event; 
        if(ev.pageX || ev.pageY){ 
          return {x:ev.pageX, y:ev.pageY}; 
        } 
        return { 
          x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
          y:ev.clientY + document.body.scrollTop - document.body.clientTop 
        }; 
      }
      function mouseMove(ev){    
          var mousePos = mousePosition(ev);  
          x = mousePos.x;
          y = mousePos.y;
      }    
      //鼠标移动钩子 
      document.onmousemove = mouseMove;
      //鼠标滚轮
      function onMouseWheel(ev) {
        ev = ev || window.event;
        var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
        down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;
        if (!down) {
          //放大
          if(scal == 5){
            scal=5
            return
          } 
          scal = (parseFloat(scal) + 0.1).toFixed(2);
          mouseWheelCb();
        } else {
          //缩小
          if (scal == 1) {
            scal=1
            return
          }
          scal = (parseFloat(scal) - 0.1).toFixed(2);
          mouseWheelCb();
        }
        if (ev.preventDefault) {/*FF 和 Chrome*/
          ev.preventDefault();// 阻止默认事件
        }
        return false;
      }
      //部分回调事件
      function mouseWheelCb(){
        if(translateX || translateY){
          home.style.transform = `scale(${scal}) translate(${translateX + 'px'}, ${translateY + 'px'})`
        }else{
          home.style.transform = "scale(" + scal + ")";
        }
        home.style.transformOrigin = x+'px' + y+'px';
        showTip();
        showScaleTip();
      }
      //鼠标滚轮钩子
      addEvent(body, 'mousewheel', onMouseWheel);
      addEvent(body, 'DOMMouseScroll', onMouseWheel);
      function addEvent(obj, xEvent, fn) {
        if (obj.attachEvent) {
          obj.attachEvent('on' + xEvent, fn);
        } else {
          obj.addEventListener(xEvent, fn, false);
        }
      }

      
      /**
       * 鼠标拖拽
       */
      var isDown = false;
      //按下
      home.onmousedown = function(e) {
          e.preventDefault();
          //获取x坐标和y坐标
          clickX = e.clientX;
          clickY = e.clientY;
          //开关打开
          isDown = true;
          //设置样式
          home.style.cursor = 'move';
      }
      //移动
      window.onmousemove = function(e) {
          if (isDown == false) return
          showTip();
          if(scal>1){
            showScaleTip()
          }
          var nx = e.clientX;
          var ny = e.clientY;
          //计算位移
          moveX = (nx-clickX)/scal;
          moveY = (ny-clickY)/scal;
          translateX = lastX + moveX;
          translateY = lastY + moveY;
          home.style.transform = `scale(${scal}) translate(${translateX + 'px'}, ${translateY + 'px'})`
      }
      //抬起
      window.onmouseup = function() {
          lastX = translateX;
          lastY = translateY;
          //开关关闭
          isDown = false;
          home.style.cursor = 'default';
      }    
      
      /**
       * Esc还原
       */
      document.addEventListener("keydown", event => {
        if (event.isComposing || event.keyCode === 27) {
          centerScale()
        }
      });
      function centerScale() {
          hideTip();
          hideScaleTip();
          scal = 1;      
          x=0;y=0;
          clickX=0;clickY=0;
          //位移
          moveX=0;moveY=0;
          //落地
          lastX=0;lastY=0;
          //移动
          translateX=0;translateY=0;
          home.style.transform = "scale(" + scal + ")";
      }     

      //还原提示
      var clearTip;
      function showTip(){
        if(clearTip) clearTimeout(clearTip)
        document.querySelector('#escTip').style.display='block';
        clearTip=setTimeout(hideTip,2000)
      }
      function hideTip(){
        if(clearTip) clearTimeout(clearTip)
        document.querySelector('#escTip').style.display='none';
      }
  
      //缩放提示
      var clearScaleTip;
      function showScaleTip(){
        if(clearScaleTip) clearTimeout(clearScaleTip)
        document.querySelector('#scaleTip').style.display='block';
        document.querySelector('#scaleTip').innerHTML=parseInt(scal*100)+'%';
        clearScaleTip=setTimeout(hideScaleTip,2000)
      }
      function hideScaleTip(){
        if(clearScaleTip) clearTimeout(clearScaleTip)
        document.querySelector('#scaleTip').style.display='none';
      }

    }
