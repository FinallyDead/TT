<template>
  <ElForm
    ref="ruleFormRef"
    :rules="rules"
    :model="formData"
  >
    <div
      class="flex space-x-2"
    >
      <div 
        class="flex w-[50%] space-x-2"
      >
        <ElFormItem 
          class="!mb-0 h-fit"
          prop="markString"
        >
           <ElInput
            v-model="formData.markString"
            style="width: 275px"
          >
          </ElInput>
        </ElFormItem>
        <ElFormItem 
          class="!mb-0 h-fit"
          prop="type"
        >
          <ElSelect
            v-model="formData.type"
            style="width: 120px"
            placeholder="Тип"
          >
            <ElOption
              v-for="type in Types"
              :key="type"
              :label="type"
              :value="type"
            />
          </ElSelect>
        </ElFormItem>
      </div>
      <ElFormItem 
        :class="{'w-full': formData.type !== Types.local}"
        class="!mb-0 h-fit"
        prop="login"
      >
        <ElInput
          v-model="formData.login"
          placeholder="Введите логин"
        >
        </ElInput>
      </ElFormItem>
      <ElFormItem
        v-if="formData.type === Types.local"
        class="!mb-0 h-fit"
        prop="password"
      >
        <ElInput
          v-model="formData.password"
          type="password"
          placeholder="Введите пароль"
          show-password
        >
        </ElInput>
      </ElFormItem>
      
      <ElButton 
        :icon="Delete" 
        type="danger"
        circle 
        @click="deleteAccount"  
      />
    </div>
  </ElForm>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core"
import { Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

enum Types {
  local = 'Локальная',
  LDAP = 'LDAP'
}

interface RuleForm {
  markString: string
  type: string
  login: string
  password: string
}

const props = defineProps<{
  modelValue: Account
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Account ): void
  (e: 'deleteAccount', index: string): void
}>()

const computedValue = computed({
    get: (): Account => {
        return props.modelValue
    },
    set: (value: Account) => {
      ruleFormRef.value?.validate((valid) => {
        if (valid) {
          emit('update:modelValue', value)
        }
      })
    }
})

const ruleFormRef = ref<FormInstance>()
const formData = ref<RuleForm>({
  markString: "",
  type: "",
  login: "",
  password: ""
})
const rules = ref<FormRules<RuleForm>>({
  markString: [
    { 
      min: 0,
      max: 50, 
      message: 'Максимальная длина 50', 
      trigger: 'blur' 
    }
  ],
  type: [
    {
      required: true,
      message: 'Выберите тип',
      trigger: 'change',
    },
  ],
  login: [
    { 
      required: true, 
      message: 'Введите логин', 
      trigger: 'blur' 
    },
    { 
      min: 1,
      max: 100, 
      message: 'Максимальная длина 100', 
      trigger: 'blur' 
    }
  ],
  password: [
    { 
      required: true, 
      message: 'Введите пароль', 
      trigger: 'blur' 
    },
    { 
      min: 1,
      max: 100, 
      message: 'Максимальная длина 100', 
      trigger: 'blur' 
    }
  ]
})

watch(formData,  useDebounceFn((newData: RuleForm): void => {
  if (newData.type === Types.LDAP) {
    newData.password = ""
  }
  const marksArray: Mark[] = newData.markString.split(';').map((el: string): Mark => {
      return {
        text: el.replace(/\s+/g, '')
      }
    }).filter((el: Mark): boolean => !!el.text)
  const {markString, ...rest} = newData;
  const newFiledsObject = {...rest, marks: [...marksArray]}
  computedValue.value = {id: computedValue.value.id, ...newFiledsObject}    

}, 1000), { deep: true })

watch(() => computedValue.value, (newValue: Account): void => {
  if (!newValue.login)
    return
  const {id, marks, ...rest} = newValue
  const markString: string = newValue.marks.map((el: Mark): string => el.text).join(';')
  const compareObject = {...rest, markString}
  if (JSON.stringify(formData.value) === JSON.stringify(compareObject)) 
    return
  formData.value = {...rest, markString: markString ? markString : "", password: rest.password || ""}
}, { deep: true, immediate: true })

function deleteAccount(): void {
  emit('deleteAccount', computedValue.value.id)
}

</script>
