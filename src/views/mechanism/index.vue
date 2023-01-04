<template>
  <el-card>
    <el-row :gutter="20" class="header">
      <el-col :span="7">
        <el-input
          placeholder="请输入搜索的机构名"
          clearable
          v-model="queryForm.query"
        ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initgetMechanism"
        ><i class="iconfont icon-search"></i> 搜索</el-button
      >
      <el-button type="primary" :icon="Search" @click="handleDialogValue()"
        >添加机构</el-button
      >
      <el-button type="primary" :icon="Search" @click="exportInfo"
        >导出数据</el-button
      >
    </el-row>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        v-for="(item, index) in options"
        :key="index"
      >
        <template v-slot="{ row }" v-if="item.prop === 'submitDate'">
          {{ $filters.changeTime(row.submitDate) }}
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'auditDate'">
          {{
            $filters.changeTime(row.auditDate)
              ? '暂未审核'
              : $filters.changeTime(row.auditDate)
          }}
        </template>
        <template #default="{ row }" v-else-if="item.prop === 'action'">
          <el-button
            size="small"
            type="success"
            @click="handleCheck(scope.$index, scope.row)"
            >审核</el-button
          >
          <el-button size="small" type="primary" @click="handleDialogValue(row)"
            >编辑</el-button
          >
          <el-button size="small" type="danger" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="queryForm.pagenum"
      v-model:page-size="queryForm.pagesize"
      :page-sizes="[2, 5, 10, 15]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @initmechanism="initgetMechanism"
    />
  </el-card>
  <Dialog
    v-model="dialogTableVisible"
    :dialogTitle="dialogTitle"
    v-if="dialogTableVisible"
    :dialogTableValue="dialogTableValue"
    :fetchMethod="initgetMechanism"
  ></Dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { options, exportInfoTitle } from './options'
import { getMechanism, checkAuthority, delMechansim } from '@/api/mechanism'
import Dialog from './component/dialog.vue'
import { isNull } from '@/utils/filters'
import { ElMessage, ElMessageBox } from 'element-plus'
import table2excel from 'js-table2excel'
const tableData = ref([])
const queryForm = ref({
  query: '',
  pagenum: 1,
  pagesize: 2
})
// 弹出框的列表信息
const dialogTableValue = ref({})
// 机构数量
const total = ref(0)
// 获取机构数据
const initgetMechanism = async () => {
  const res = await getMechanism(queryForm.value)
  tableData.value = res.data
  total.value = res.total
}
initgetMechanism()
// 改变页数大小
const handleSizeChange = (pageSize) => {
  queryForm.value.pagenum = 1
  queryForm.value.pagesize = pageSize
  initgetMechanism()
}
// 改变当前页
const handleCurrentChange = (pageNum) => {
  queryForm.value.pagenum = pageNum
  initgetMechanism()
}
// 弹出框状态
const dialogTableVisible = ref(false)
// 修改机构、添加机构
const handleDialogValue = (row) => {
  if (isNull(row)) {
    dialogTitle.value = '添加机构'
    dialogTableValue.value = {
      name: '',
      type: '',
      owner: '',
      address: '',
      phone: '',
      submitDate: new Date().getTime() / 1000,
      auditDate: null
    }
  } else {
    dialogTitle.value = '机构信息修改'
    dialogTableValue.value = row
    console.log('列表信息', row)
  }
  dialogTableVisible.value = true
}
// 弹出框标题
const dialogTitle = ref('')
// 删除机构信息
const handleDelete = async (row) => {
  ElMessageBox.prompt('请输入权限密码', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputErrorMessage: '密码错误'
  })
    .then(async ({ value }) => {
      const res = await checkAuthority(value)
      if (res.status === 200) {
        const res1 = await delMechansim(row)
        if (res1.status === 200) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          initgetMechanism()
        } else {
          ElMessage({
            type: 'success',
            message: '删除失败，稍后重试'
          })
        }
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消'
      })
    })
}
// 导出数据
const exportInfos = reactive([])
const handleSelectionChange = (selection) => {
  exportInfos.value = selection
}

const excelName = '养老机构信息_' + new Date().toLocaleString()
const exportInfo = () => {
  table2excel(exportInfoTitle, exportInfos.value, excelName, excelName)
}
</script>

<style lang="scss" scoped>
.header {
  padding-bottom: 16px;
  box-sizing: border-box;
}
</style>
