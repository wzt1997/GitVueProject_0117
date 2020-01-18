<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt>
      </div>

      <!-- <el-form  class="login_form" ref="loginFormRef"> -->

      <div class="login_form">
        <el-form ref="loginFormRef" :model="loginform" label-width="80px" :rules="loginformRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginform.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginform.password"
              prefix-icon="el-icon-key"
              placeholder="请输入密码"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item class="btnclass">
            <el-button @click="login" type="primary" plain>登录</el-button>
            <el-button @click="resetLoginForm" type="info" plain>重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- //   </el-form> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //登陆表单的数据对象
      loginform: {
        username: "admin",
        password: "123456"
      },
      //表单的验证规则
      loginformRules: {
        //验证用户名
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 16, message: "长度在5到16个字符之间", trigger: "blur" }
        ],
        //验证密码
        password: [
          { required: true, message: "请输入登陆密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6到15个字符之间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      //表单登录预验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          //如果不符合请求要求
          return;
        }
        //login是请求路径，post是请求方法
        const { data: res } = await this.$http.post("login", this.loginform);
        //返回的属性中除了data都是axios帮我们封装好的
        //直接解构取出data命名为res
        //console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("登陆失败!");
        }
        this.$message.success("登陆成功!");
        //1. 将登陆成功之后的token保存到客户端的sessionStorage中
        //  1.1 除了登陆以外的其他API接口必须登录之后才能访问
        //  1.2 token只应在网站打开期间生效
        //2. 转到主页/home
        window.sessionStorage.setItem('token',res.data.token);
        this.$router.push('/home'); //页面跳转

        //路由导航守卫——如果用户没有登陆，直接通过URL访问特定页面，则重新导航到登陆页面

      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -30%);
    background-color: #eee;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0px;
  right: 10px;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

.btnclass {
  display: flex;
  justify-content: flex-end;
}
</style>
