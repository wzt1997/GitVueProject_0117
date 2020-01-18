

<template>
  <el-container class="home-container">
    <!--  头部区域 -->
    <el-header>
      <div>
        <img src="../assets/backstage.png" alt="backstage" class="backstage_icon">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 页面侧边栏 -->
      <!-- 根据折叠状态改变侧边栏宽度 -->
      <el-aside :width="iscollapse? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          |||
        </div>
        <!-- 侧边栏菜单区域 -->
        <!-- 直接写unique-open或者:unique-open="true" -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="iscollapse" :collapse-transition="false" :router="true" :default-active="activePath"> 
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
          <!-- 路由占位符 -->
          <!-- 路由跳转的时候只改变路由占位符部分的内容 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
//新页面->新建组件、设置路由规则
export default {
  data(){
    return{
      //左侧菜单数据
      menuList:[],
      iconsObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-s-promotion',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-marketing'
      },
      //是否折叠
      iscollapse:false,
      //被激活的链接地址
      activePath:''
    }
  },
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      //退出的原理是清空token然后回到登录页
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取所有的菜单
    async getMenuList(){
      //这里的this就是指的本文件定义的vue component
      const {data:res} = await this.$http.get('menus');
      if(res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      
    },
    //菜单折叠与展开
    toggleCollapse(){
      this.iscollapse = ! this.iscollapse;
    },
    // 保存链接的激活状态到SessionStorage,在每次点击或者刷新页面的时候获取并高亮对应item
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath', activePath);
        this.activePath = activePath;
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #eee;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      height: 50px;
      width: 50px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right:none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont{
  margin-left:10px;
}

.toggle-button{
  background-color: #4a5064;
  font-size:12px;
  line-height:24px;
  color:#eee;
  text-align:center;
  letter-spacing: 2px;
  cursor:pointer;

}
</style>

