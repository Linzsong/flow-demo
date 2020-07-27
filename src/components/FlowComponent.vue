<template>
  <div>
    <div class="header">
      <span>文件名</span>
      <input type="text" v-model="flowName" />
      <button @click="handle_new">新建</button>
      <button @click="handle_save">保存数据</button>
      <button @click="handle_savePng">导出PNG</button>
    </div>
    <div class="page">
      <div class="tools">
        <div v-for="(item, index) in tools" :key="index">
          <div class="title">{{ item.group }}</div>
          <div class="buttons">
            <a
              v-for="(btn, i) in item.children"
              :key="i"
              :title="btn.name"
              :draggable="btn.data"
              @dragstart="onDrag($event, btn)"
            >
              <i :class="`iconfont ${btn.icon}`"></i>
            </a>
          </div>
        </div>
      </div>
      <div id="topology-canvas" class="full" @contextmenu="onContextMenu($event)"></div>
      <!-- <div class="props" :style="props.expand ? 'overflow: visible' : ''">
        <CanvasProps :props.sync="props" @change="onUpdateProps"></CanvasProps>
      </div>-->
      <div class="context-menu" v-if="contextmenu.left" :style="this.contextmenu">
        <CanvasContextMenu :canvas="canvas" :props.sync="props"></CanvasContextMenu>
      </div>
    </div>
  </div>
</template>

<script>
import { Topology, Node, Line } from "@topology/core";
import { Tools, canvasRegister } from "../../services/canvas";
// import CanvasProps from '~/components/CanvasProps'
import CanvasContextMenu from "./CanvasContextMenu";
const canvasOptions = {
 
};

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      canvas: {},
      tools: Tools,
      props: {
        node: null,
        line: null,
        nodes: null,
        multi: false,
        expand: false,
        locked: false,
      },
      contextmenu: {
        left: null,
        top: null,
        bottom: null,
      },
      flowName: "",
      arrNodes: [], //节点数据
      arrLines: [], //连线数据
    };
  },
  components: {
    // CanvasProps,
    CanvasContextMenu,
  },
  created() {
    canvasRegister();
    document.onclick = (event) => {
      // console.log(1111);
      this.contextmenu = {
        left: null,
        top: null,
        bottom: null,
      };
    };
  },
  mounted() {
    canvasOptions.on = this.onMessage;
    this.canvas = new Topology("topology-canvas", canvasOptions);
    // this.open()
  },
  methods: {
    /**
     * 左侧图形拖拽方法
     */
    onDrag(event, node) {
      console.log(event, node);
      console.log(node)
      event.dataTransfer.setData("Text", JSON.stringify(node.data));
    },

    opend() {
      const json = { pens: [xxxx] };
      this.canvas.open(json);
    },

    reander() {
      this.canvas.render();
    },

    onContextMenu(event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.clientY + 360 < document.body.clientHeight) {
        this.contextmenu = {
          left: event.clientX + "px",
          top: event.clientY + "px",
        };
      } else {
        this.contextmenu = {
          left: event.clientX + "px",
          bottom: document.body.clientHeight - event.clientY + "px",
        };
      }
    },

    onMessage(event, data) {
      // 右侧输入框编辑状态时点击编辑区域其他元素，onMessage执行后才执行onUpdateProps方法，通过setTimeout让onUpdateProps先执行
      setTimeout(() => {
        switch (event) {
          case "node":
          case "addNode":
            this.props = {
              node: data,
              line: null,
              multi: false,
              expand: this.props.expand,
              nodes: null,
              locked: data.locked,
            };
            break;
          case "line":
          case "addLine":
            this.props = {
              node: null,
              line: data,
              multi: false,
              nodes: null,
              locked: data.locked,
            };
            break;
          case "multi":
            this.props = {
              node: null,
              line: null,
              multi: true,
              nodes: data.length > 1 ? data : null,
              locked: this.getLocked({ nodes: data }),
            };
            break;
          case "space":
            this.props = {
              node: null,
              line: null,
              multi: false,
              nodes: null,
              locked: false,
            };
            break;
          case "moveOut":
            break;
          case "moveNodes":
          case "resizeNodes":
            if (data.length > 1) {
              this.props = {
                node: null,
                line: null,
                multi: true,
                nodes: data,
                locked: this.getLocked({ nodes: data }),
              };
            } else {
              this.props = {
                node: data[0],
                line: null,
                multi: false,
                nodes: null,
                locked: false,
              };
            }
            break;
          case "resize":
          case "scale":
          case "locked":
            if (this.canvas && this.canvas.data) {
              this.$store.commit("setCanvas", {
                scale: this.canvas.data.scale || 1,
                lineName: this.canvas.data.lineName,
                fromArrowType: this.canvas.data.fromArrowType,
                toArrowType: this.canvas.data.toArrowType,
                fromArrowlockedType: this.canvas.data.locked,
              });
            }
            break;
        }
      }, 0);
    },

    getLocked(data) {
      let locked = true;
      if (data.nodes && data.nodes.length) {
        for (const item of data.nodes) {
          if (!item.locked) {
            locked = false;
            break;
          }
        }
      }
      if (locked && data.lines) {
        for (const item of data.lines) {
          if (!item.locked) {
            locked = false;
            break;
          }
        }
      }
      return locked;
    },

    handle_new() {
      this.canvas.open({ nodes: [], lines: [] });
      this.flowName == "";
    },

    handle_save() {
      //保存流程图节点和连线数据    type==0 节点    type==1 连线
      this.canvas.data.pens.forEach((element) => {
        if (element.type == 0) {
          this.arrNodes.push(element);
        } else if (element.type == 1) {
          this.arrLines.push(element);
        }
      });
      console.log("flowName:", this.flowName);
      console.log("this.arrNodes:", this.arrNodes);
      console.log("this.arrLines:", this.arrLines);
    },

    handle_savePng() {
      this.canvas.saveAsImage(this.flowName + ".png");
    },
  },
  destroyed() {
    this.canvas.destroy();
  },
};
</script>
<style scoped lang="scss">
@import url(//at.alicdn.com/t/font_1113798_nklzr6lk7z.css);

.header {
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #f8f8f8;
  border-bottom: solid 1px #e6e6e6;
  font-size: 14px;

  span,
  input {
    margin-left: 20px;
  }

  button {
    margin: 0 15px;
  }
}
.page {
  display: flex;
  width: 100%;
  height: 100%;

  .tools {
    flex-shrink: 0;
    width: 230px;
    background-color: #f8f8f8;
    border-right: 1px solid #d9d9d9;
    overflow-y: auto;

    .title {
      color: #0d1a26;
      font-weight: 600;
      font-size: 16px;
      line-height: 1;
      padding: 5px 20px;
      margin-top: 5px;
      border-bottom: 1px solid #ddd;

      &:first-child {
        border-top: none;
      }
    }

    .buttons {
      padding: 10px 0px;
      display: flex;
      flex-wrap: wrap;
      a {
        display: inline-block;
        color: #314659;
        line-height: 1;
        width: 20px;
        height: 20px;
        padding: 8px 28px;
        text-align: center;
        text-decoration: none !important;
        cursor: pointer;

        .iconfont {
          font-size: 25px;
        }

        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .full {
    flex: 1;
    width: initial;
    position: relative;
    overflow: auto;
    background: #fff;
    border-bottom: 1px solid #d9d9d9;
  }

  .props {
    flex-shrink: 0;
    width: 2.4rem;
    padding: 0.1rem 0;
    background-color: #f8f8f8;
    border-left: 1px solid #d9d9d9;
    overflow-y: auto;
    position: relative;
  }

  .context-menu {
    position: fixed;
    z-index: 10;
  }
}
</style>
