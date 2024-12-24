<template>
  <div
    class="flex items-center h-[100vh]"
  >
    <div 
      class="border-solid border-2 shadow-inner p-4 w-[55%] m-auto rounded-md"
    >
      <div 
        class="flex items-center"
      >
        <h1 
          class="text-2xl font-bold"
        >
          Учётные записи
        </h1>
        <ElButton 
          plain
          class="ml-4 !py-[20px] !px-[12px]"
          :icon="Plus"
          @click="addAccount"
        >
        </ElButton>
      </div>

      <div 
        class="mt-4 flex items-center bg-[#EEF4FA] px-2 py-1"
      >
        <ElIcon
          :size="25"
        >
          <QuestionFilled />
        </ElIcon>
        <span
          class="ml-2 text-base"
        >
          Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
        </span>
      </div>

      <div
        class="mt-4"
      >
        <div
          v-if="showCols"
          class="flex text-gray-400 text-base"
        >
          <div
            class="basis-[35%]"
          >
            <span>
              Метки
            </span>
          </div>
          <div
            class="basis-[16%]"
          >
            <span>
              Тип записи
            </span>
          </div>
          <div
            :class="{'basis-[40%]': !showPasswordCol, 'basis-[22%]': showPasswordCol}"
          >
            <span>
              Логин
            </span>
          </div>
          <div
            v-if="showPasswordCol"
            class="basis-[22%]"
          >
            <span>
              Пароль
            </span>
          </div>
        </div>
        <template
          v-for="(account, index) in tableData"
          :key="account.id"
        >
          <AccountData
            v-model="tableData[index]"
            class="mt-5 first:mt-2"
            @delete-account="deleteAccount"
          />
        </template>     
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import { makeid } from '~/composables/generateId'

enum Types {
  local = 'Локальная',
  LDAP = 'LDAP'
}

const accountStore = useAccountStore()
const tableData = ref<Account[]>([])

onMounted((): void => {
  if (accountStore.accounts.length > 0) {
    tableData.value = [...accountStore.accounts]
  }
})

const showPasswordCol = computed((): boolean => {
  return tableData.value.some((account: Account): boolean => account.type === Types.local)
})

const showCols = computed((): boolean => {
  return tableData.value.length > 0
})

watch(tableData, (value: Account[]): void => {
  accountStore.setAccounts(value)
}, { deep: true })

function addAccount(): void {
  tableData.value.push({
    id: makeid(Math.floor(Math.random() * 10) + 1),
    marks: [],
    type: "",
    login: "",
    password: "",
  })
}

function deleteAccount(id: string): void {
  const index = tableData.value.findIndex((account: Account): boolean => account.id.localeCompare(id) === 0)
  tableData.value.splice(index, 1)
}
</script>