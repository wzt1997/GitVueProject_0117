<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色列表 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 先拿到用户对应权限 -->
          <template slot-scope="scope">
            <!-- i1这里默认为索引 -->
            <el-row
              :class="['bdbottom', i1 === 0? 'bdtop' : '','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <!-- 总共24列 -->
              <el-col :span="19">
                <el-row
                  :class="[ i2===0 ? '':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <!-- 在第二级row里面重新进行了栅格化，共24列 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- tag里面就是icon属性，i里面就是class属性 -->
            <el-tag type="primary" icon="el-icon-edit">编辑</el-tag>
            <el-tag type="danger" icon="el-icon-delete">删除</el-tag>
            <el-tag
              style="cursor:pointer"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      setRightDialogVisible: false, //控制分配权限的对话框的显示
      rightsList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      defkeys:[],
      //当前即将分配权限的角色ID
      roleId:''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
      console.log(this.roleList);
    },
    //根据ID删除对应权限
    async removeRightById(role, rightId) {
      //弹框提示用户
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult != "confirm") {
        return this.$message.info("取消删除权限");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }

      this.$message.success("删除权限成功");
      role.children = res.data;
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {

      this.roleId = role.id;
      //获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }

      //保存获取到的权限数据
      this.rightsList = res.data;
      console.log(this.rightsList);

      //递归获取三级节点ID
      this.getLeafKeys(role, this.defkeys);

      this.setRightDialogVisible = true;
    },
    //通过递归的形式获取全部三级权限的ID
    getLeafKeys(node, arr){
      if (!node.children){ //如果是叶子节点
        return arr.push(node.id);
      }
      node.children.forEach(item =>
        this.getLeafKeys(item, arr)
      )
    },
    setRightDialogClosed(){
      this.defkeys = []
    },
    //为角色分配权限
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ] //拿到所有全选和半选的项的id
      
      const idSTR = keys.join(',');
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idSTR});
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败!");
      }
      this.$message.success("分配权限成功！");
      this.getRolesList();
      this.setRightDialogVisible = false;

    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
