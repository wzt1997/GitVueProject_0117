<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- el-row和el-col一般都是配合使用的 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog" style="margin-bottom : 12px;">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        show-index
        border
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_delete === false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="warning" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区 -->
      <!-- 这里的绑定本质是分页区在读取queryInfo的内容，是单向的绑定 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2,3,4,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCatDialogVisible" width="50%" @close="addCateDialogClosed">
      <el-form :model="addCatForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择框 -->
          <!-- options指定数据源 -->
          <!-- Props用来指定配置对象 -->
          <!-- value双向绑定选择的值，而且必须是个数组 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCatList"
            :props="cascadeProps"
            @change="parentCatChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类数据列表
      cateList: [],
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //为table指定列的对应
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "350px"
        },
        {
          label: "是否有效",
          //将当前列定义为模板列
          type: "template",
          //表示当前列所使用的模板名称
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      addCatDialogVisible: false,
      addCatForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 5, max: 16, message: "长度在5到16个字符之间", trigger: "blur" }
        ]
      },
      //父级分类列表
      parentCatList: [],
      //指定级联选择器的配置对象
      cascadeProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover"
      },
      //选中的父级分类
      selectedKeys: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败!");
      }

      console.log(res.data);
      this.cateList = res.data.result;
      this.total = res.data.total;
      console.log(this.cateList);
    },
    //监听PageSize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddDialog() {
      //获取父级分类的数据
      this.getParentCateList();
      this.addCatDialogVisible = true;
    },
    //获取父级分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2
        }
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败!");
      }

      this.parentCatList = res.data;
    },
    //监听选择项发生变化
    parentCatChange() {
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCatForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];

        //当前分类的等级
        this.addCatForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCatForm.cat_pid = 0;
        //当前分类的等级
        this.addCatForm.cat_level = 0;
        return;
      }
    },
    //点击按钮。添加新的分类
    addCate(){
        //console.log(this.addCatForm);
        this.$refs.addCateFormRef.validate( async valid=> {
          if (!valid) return
          const {data:res} = await this. $http.post('categories', this.addCatForm)
        
          if (res.meta.status !== 201){
            return this.$message.error("添加分类失败")
          }

          this.$message.success("添加分类成功!");
          this.getCateList();
          this.addCatDialogVisible = false;
        } )
    },
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCatForm.cat_pid = 0;
      this.addCatForm.cat_level = 0;
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
