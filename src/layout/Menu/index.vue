<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="$menuBg"
    class="el-menu-vertical-demo"
    :default-active="defaultActive"
    text-color="#fff"
    router
    unique-opened
    :collapse="!$store.getters.siderType"
  >
    <el-sub-menu
      :index="item._id"
      v-for="item in menusList.data"
      :key="item._id"
    >
      <template #title>
        <el-icon> <i :class="'iconfont icon-' + item.icon" /></el-icon>

        <span style="margin-left: 0.4em">{{ item.authName }}</span>
      </template>
      <el-menu-item
        :index="'/' + item1.path"
        v-for="item1 in item.children"
        :key="item1.id"
        @click="savePath(item1.path)"
      >
        <i class="iconfont icon-list" />
        <span style="margin-left: 0.4em">{{ item1.authName }}</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { menuList } from '@/api/menu'
import { ref } from 'vue'
const defaultActive = ref(sessionStorage.getItem('path') || '/mechanism')
const menusList = ref([])
const initMenuList = async () => {
  menusList.value = await menuList()
  // console.log(menusList.value)
}
initMenuList()
const savePath = (path) => {
  sessionStorage.setItem('path', `/${path}`)
}
</script>

<style lang="scss" scoped>
.el-sub-menu :hover {
  background-color: $menuHover !important;
}
</style>
