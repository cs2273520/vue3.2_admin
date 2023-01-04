<template>
  <el-dialog
    :model-value="dialogTableVisible"
    :title="dialogTitle"
    @close="handelClose"
    width="30%"
  >
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="机构名" prop="name">
        <el-input v-model="form.name" />
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
      <el-form-item label="机构类型" prop="type">
        <el-select v-model="form.type" class="m-2" placeholder="请选择类型">
          <el-option
            v-for="item in typeoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-upload
        class="upload-demo"
        :action="uploadImagesUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple
        :limit="2"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :data="ImagesUrlName"
        :auto-upload="false"
        :on-change="onChange"
        ref="upload"
        v-if="props.dialogTitle === '添加机构'"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div :v-slot="tip" class="el-upload__tip">
          请上传营业执照+个人身份证
        </div>
      </el-upload>
      <div class="images">
        <el-button
          text
          @click="showimage1"
          v-if="props.dialogTitle !== '添加机构'"
        >
          证件1
        </el-button>
        <el-button
          text
          @click="showimage2"
          v-if="props.dialogTitle !== '添加机构'"
        >
          证件2
        </el-button>
      </div>

      <el-dialog v-model="dialogVisible" class="preImg">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
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
import {
  defineEmits,
  ref,
  defineProps,
  watch,
  reactive,
  getCurrentInstance
} from 'vue'
import { addMechansim, editMechansim } from '@/api/mechanism'
import { ElMessage } from 'element-plus'
import { typeoptions } from '../options'
const uploadImagesUrl = ref('http://localhost:3003/api/uploadImages')
const loadImageUrl = ref('http://127.0.0.1:3003/data/')
// const value = ref('')
const ImagesUrlName = reactive({ name: localStorage.getItem('token') })

const form = ref({
  name: '',
  type: '',
  owner: '',
  address: '',
  phone: '',
  submitDate: new Date().getTime() / 1000,
  auditDate: 'testTime',
  image1: '',
  image2: ''
})

const rules = ref({
  name: [{ required: true, message: '请输入机构名字', trigger: 'blur' }],
  type: [{ required: true, message: '请输入机构类型', trigger: 'blur' }],
  owner: [{ required: true, message: '请输入机构持有者', trigger: 'blur' }],
  address: [{ required: true, message: '请输入机构经营地址', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入机构持有者电话', trigger: 'blur' },
    // eslint-disable-next-line no-useless-escape
    { patern: '/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/' }
  ]
})

const props = defineProps({
  dialogTitle: {
    type: String,
    default: '',
    required: true
  },
  dialogTableValue: {
    type: Object,
    default: () => {}
  },
  fetchMethod: {
    type: Function,
    default: () => {}
  }
})

const showimage1 = async () => {
  dialogVisible.value = true
  dialogImageUrl.value = loadImageUrl.value + props.dialogTableValue.image1
}
const showimage2 = async (dta) => {
  dialogVisible.value = true
  dialogImageUrl.value = loadImageUrl.value + props.dialogTableValue.image2
  // ImagesUrlName.value = props.dialogTableValue.image2
}

watch(
  () => props.dialogTableValue,
  () => {
    form.value = props.dialogTableValue
  },
  { deep: true, immediate: true }
)
const emits = defineEmits(['update:modelValue', 'initmechanism'])

const handelClose = () => {
  emits('update:modelValue', false)
}

const { proxy } = getCurrentInstance()
const handelConfirm = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (props.dialogTitle === '添加机构') {
        const uploadfile = proxy.$refs.upload.uploadFiles
        form.value.image1 = ImagesUrlName.name + uploadfile[0].name
        form.value.image2 = ImagesUrlName.name + uploadfile[1].name
        const res = await addMechansim(form.value)
        if (res.status === 200) {
          await proxy.$refs.upload.submit()
        }
        ElMessage({
          message: res.info,
          center: true,
          type: 'success'
        })
        props.fetchMethod()
      } else {
        const res = await editMechansim(form.value)
        ElMessage({
          message: res.info,
          center: true,
          type: 'success'
        })
      }
      emits('initmechanism')
      handelClose()
    } else {
      console.log('请填写完整内容')
      return false
    }
  })
}
const formRef = ref(null)

const fileList = ref([
  //   {
  //     name: 'food.jpeg',
  //     url: 'C:\\Users\\a\\Desktop\\1.jpg'
  //   },
  //   {
  //     name: 'food2.jpeg',
  //     url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  //   }
])
const handleExceed = (files, fileList) => {
  console.log(
    `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      files.length + fileList.length
    } 个文件`
  )
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true

  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = (event) => {
    dialogImageUrl.value = event.target.result
  }
}
</script>

<style lang="scss" scoped>
.upload-demo {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
::v-deep .el-upload-list__item {
  padding-left: 20px;
}
::v-deep .el-dialog__body {
  img {
    width: 100% !important;
    height: 100% !important;
  }
}
.images {
  display: flex;
  padding-left: 25px;
}
.el-form-item__label-wrap {
  margin-left: 0px !important;
}
</style>
