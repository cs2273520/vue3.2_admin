<template>
  <el-dialog
    :model-value="dialogTableVisible"
    :title="dialogTitle"
    @close="handelClose"
    width="30%"
  >
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="机构名" prop="authName">
        <el-input v-model="form.authName" />
      </el-form-item>
      <el-form-item label="机构类型" prop="authName">
        <el-input v-model="form.type" />
      </el-form-item>
      <el-form-item label="持有人" prop="owner">
        <el-input v-model="form.owner" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="经营地址" prop="address">
        <el-input v-model="form.address" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handelClose">取消</el-button>
        <el-button type="primary" @click="handelConfirm"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, ref, defineProps } from 'vue'
import { addMechansim } from '@/api/mechanism'

defineProps({
  dialogTitle: {
    type: String,
    default: '',
    required: true
  }
})

const emits = defineEmits(['update:modelValue'])

const handelClose = () => {
  emits('update:modelValue', false)
}
const handelConfirm = async () => {
  const res = await addMechansim(form.value)
  console.log(res)
  handelClose()
}
const formRef = ref(null)
const form = ref({
  authName: '',
  type: '',
  owner: '',
  address: '',
  phone: ''
})

const rules = ref({
  authName: [{ required: true, message: '请输入机构名字', trigger: 'blur' }],
  type: [{ required: true, message: '请输入机构类型', trigger: 'blur' }],
  owner: [{ required: true, message: '请输入机构持有者', trigger: 'blur' }],
  address: [{ required: true, message: '请输入机构经营地址', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入机构持有者电话', trigger: 'blur' },
    // eslint-disable-next-line no-useless-escape
    { patern: '/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/' }
  ]
})
</script>

<style lang="scss" scoped></style>
