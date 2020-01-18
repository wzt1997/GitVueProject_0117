

<template>
    <div>
        <el-button type='info' @click='logout'>
            退出
        </el-button>
        home 组件

    </div>
</template>

<script>
//新页面->新建组件、设置路由规则
export default {
    methods:{
        logout(){
            //退出的原理是清空token然后回到登录页
            window.sessionStorage.clear();
            this.$router.push("/login");
        }
    }
    
}
</script>

<style lang="less" scoped>

</style>

