<template>
        <span :tabindex="tabindex" @focus="handlerFocus"  class="kz-input-fit" @click="handlerEdit" v-clickoutside="handlerEnd" >
            <span >{{inputValue}}</span>
            <span class="edits" ref="warp" v-show="eidt">
                <input :type="type" :maxlength="maxlength" class="kz-edit-input"  @focus="inputHandlerFocus"  ref="sercheInput" @keyup="handlerKeyup"  @change="handlerChange" @keydown="handlerKeydown" v-model="inputValue"  />
            </span>
            <span v-if="$slots.btn&&eidt" class="kz-input-slot">
                <slot name="btn"></slot>
            </span>

            <transition
              name="el-zoom-in-top"
            >
              <div v-show="unfold" class="kz-droplist-wrap" ref="drap" :style="'width:'+warpWidth">
                <div  class="popper__arrow" style="left: 35px;"></div>
                <div ref="droplist" class="kz-droplist" >
                  <div class="kz-serche-head" v-if="options.length>1"  >
                    <span :key="index"  v-for="(item,index) in options" :style="(!item.width?'flex:1;':'')+'width:'+item.width+';padding:3px'"  >
                        {{item.label}}
                    </span> 
                  </div>
                  <div style="max-height: 250px;overflow: auto;"  v-if="filterList.length>0">
                    <div 
                      @click='itemClick(item)' 
                      @mouseenter='handlerEnter(index)'
                      :key="index" v-for="(item,index) in filterList"
                      :class="'kz-list-item '+(current==index?'on':'')" >
                      <p style="display:flex;width:100%;height:100%" v-if="options.length>0" >
                        <span :key="index"
                        v-for="(opt,index) in options"
                        :style="(!opt.width?'flex:1;':'')+'width:'+opt.width+';padding:3px'" 
                        >
                            {{item[opt.prop]}}
                        </span>
                      </p>
                      <span v-else style="flex:1"  >
                          {{item}}
                      </span>
                    </div>
                  </div>
                  <div v-else style="text-align:center"  >
                      <span style="flex:1">没有匹配的选项</span>
                  </div>
                </div>
                <slot></slot>
              </div>  
              </transition> 
        </span>
</template>
<script>
import Clickoutside from "../lib/clickoutside";
import scrollIntoView from "../lib/scroll-into-view";
export default {
  name: "kz-editable-input",
  data() {
    return {
      eidt: false,
      unfold: false,
      current: null,
      fulshPos: null
    };
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    filterList() {
      // `this` points to the vm instance
      return this.match(this.inputValue,this.data);
    },
    warpWidth() {
      let unm = 0,
        ext = "px";
      if (this.options.length > 0) {
        ext = this.getEXt(this.options[0].width) || "px";
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].width) {
            unm += parseFloat(this.options[i].width);
          }
        }
        unm += this.options.length * 6;
      }
      if (unm == 0) {
        return "100%";
      }
      return unm + ext;
    }
  },
  props: {
    serch: {
      type: Boolean,
      default: false
    },
    match: {
      type: Function,
      default: function(str,data) {
        return data;
      }
    },
    itemSelecet: {
      type: Function,
      default: function(row) {
        this.handlerEnd();
      }
    },
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },
    focusModes: {
      type: String,
      default: "focus"
    },
    maxlength: {
      type: Number,
      default: 999
    },
    type: {
      type: String,
      default: "text"
    },
    value: {},
    tabindex: {
      type: Number,
      default: 0
    }
  },
  components: {},
  directives: { Clickoutside },
  mounted() {},
  methods: {
    getEXt(str) {
      //获取后缀
      if (!str || typeof str != "string") {
        return "";
      }
      return str.replace(str.match(/(-?\d+)(\.\d+)?/)[0], "");
    },
    handlerEnter(i) {
      this.current = i;
    },
    itemClick(row) {
      this.unfold=false;
      this.itemSelecet(row,this);
    },
    inputHandlerFocus(e) {
      this.$emit("focus", { e: e, el: this });
    },
    handlerFocus(e) {
      this.handlerEdit();
    },
    select() {
      this.eidt = true;
      setTimeout(() => {
        this.$refs.sercheInput.focus();
        this.$refs.sercheInput.select();
      }, 1);
    },
    eidtCell() {
      this.handlerEdit();
    },
    handlerEdit() {
      if (!this.eidt) {
        this.eidt = true;
        setTimeout(() => {
          this.$refs.sercheInput.focus();
          if (this.focusModes == "all") {
            this.$refs.sercheInput.select();
          }
        }, 10);
      }
    },
    setRect() {
      let rect = this.$refs.warp.getBoundingClientRect();
      if(rect.left>50){
          this.$refs.drap.style.left = rect.left + "px";
          this.$refs.drap.style.top = rect.top + rect.height + "px";
      }
      if (!this.fulshPos) {
        this.fulshPos = setInterval(() => {
          if (!this.unfold) {
            clearInterval(this.fulshPos);
          }
          this.setRect();
        }, 300);
      }
    },
    showFlod() {
      setTimeout(() => {
        this.unfold = true;
        if (!(this.$refs.drap.parentNode == document.body)) {
          this.$refs.drap.parentNode.removeChild(this.$refs.drap);
          document.body.appendChild(this.$refs.drap);
        }
        this.setRect();
      }, 10);
    },
    handlerEnd() {
      if (this.eidt) {
        this.eidt = false;
        this.unfold = false;
        this.$emit("end", this);
      }
    },
    handlerChange(e) {
      this.$emit("change", { e: e, handlerEnd: this.handlerEnd });
    },
    handlerKeyup(e) {
      this.$emit("keyup", { e: e, handlerEnd: this.handlerEnd });
    },
    scrollIntoView(){
      let menu = this.$refs.droplist;
      if (menu) {
        //console.log(this.$refs)
        try {
          if (menu.children.length > 1) {
            var target = this.$refs.droplist.children[1].children[this.current];
            menu=this.$refs.droplist.children[1];
          } else {
            var target = this.$refs.droplist.children[0].children[this.current];
            menu=this.$refs.droplist.children[0];
          }
          setTimeout(()=>{
            if(this.current==0){
              menu.scrollTop=0;  
            }else{
              scrollIntoView(menu, target); 
            }
            
          },10)
        } catch (error) {
         console.log(error)
        }
      }
    },
    setSerchEvent(e){
      let len=this.filterList.length;
      if (e.code == "ArrowDown" && this.unfold) {
        this.current =
          (this.current + len + 1) % len;          
      }
      if (e.code == "ArrowUp" && this.unfold) {
        this.current =
          (this.current + len - 1) % len;
      }
      if ((e.code == "Enter"||e.code == "NumpadEnter") && this.unfold) {
        if (this.filterList[this.current]) {
          this.itemClick(this.filterList[this.current]);
          this.current=-1
          return false;
        }
      }
      if((e.code != "Enter"&&e.code != "NumpadEnter"&&e.code != "tab")&& !this.unfold){
        if (e.code == "ArrowUp" && e.code == "ArrowDown"){
          this.current=0;
        }else{
          this.current=-1
        }
        this.showFlod();
      }
      if((e.code != "Enter"&&e.code != "NumpadEnter"&&e.code != "tab"&&e.code != "ArrowUp" && e.code != "ArrowDown")&& this.unfold){
          this.current=-1
      }
        this.scrollIntoView(); 
      
      return true;
    },
    handlerKeydown(e) {
      if(this.serch){
        if(!this.setSerchEvent(e)){
          return;
        }
      }
      if (e.code == "Tab") {
        this.handlerEnd();
      }
      this.$emit("keydown", { e: e, handlerEnd: this.handlerEnd });
    }
  }
};
</script>

<style>
.kz-input-fit {
  display: inline-block;
  width: 100%;
  min-height: 15px;
  height: 100%;
}

.kz-input-fit .edits {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
}
.kz-input-fit .edits .kz-edit-input {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 12px 10px;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  border-color: #409eff;
  text-align: inherit;
}
.kz-input-slot {
  position: absolute;
  right: 5px;
  top: 5px;
}
/*下拉加载的*/

.kz-droplist-wrap *::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.kz-droplist-wrap *::-webkit-scrollbar-track-piece {
  background-color: #cccccc;
  -webkit-border-radius: 6px;
}
.kz-droplist-wrap *::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: #999999;
  -webkit-border-radius: 6px;
}
.kz-droplist-wrap *::-webkit-scrollbar-thumb:horizontal {
  width: 5px;
  background-color: #999999;
  -webkit-border-radius: 6px;
}
.kz-droplist-wrap {
  width: 100%;
  position: absolute;
  left: 0px;
  top: 122%;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  z-index: 9999;
}
.kz-droplist {
  border-radius: 5px;
  font-size: 12px;
  background: #fff;
  padding: 3px;
  list-style: none;
  padding: 0px 0 6px;
  margin: 0;
  box-sizing: border-box;
}

.kz-droplist .kz-list-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kz-droplist .kz-list-item {
  padding: 3px 5px;
  margin: 2px 0px;
  display: flex;
  font-size: 12px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 28px;
  box-sizing: border-box;
  cursor: pointer;
}
.kz-droplist .kz-list-item span,
.kz-droplist .kz-serche-head span {
  display: inline-block;
}
.kz-list-item:hover,
.kz-list-item.on {
  background-color: #f5f7fa;
}


.kz-triangle-down {
  padding: 0 5px;
  cursor: pointer;
  display: block;
  height: 100%;
  min-height: 20px;
}
.kz-triangle-down::after {
  content: " ";
  width: 0;
  height: 0;
  display: block;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 6px solid rgb(95, 95, 95);
  position: relative;
  top: 8px;
}
.kz-fuzzy .popper__arrow {
  top: -6px;
  left: 50%;
  margin-right: 3px;
  border-top-width: 0;
  border-bottom-color: #ebeef5;
  border-width: 6px;
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
}
.kz-fuzzy .popper__arrow::after {
  content: " ";
  border-width: 6px;
}
.kz-fuzzy .popper__arrow,
.kz-fuzzy .popper__arrow::after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}
</style>
