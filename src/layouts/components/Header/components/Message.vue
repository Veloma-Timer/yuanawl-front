<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-badge :value="messageTtem.length" class="item">
          <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="今日工单的通知" name="first">
          <div class="message-list">
            <div class="message-item">
              <div class="message-content" v-for="item in messageTtem" :key="item.orderCode">
                <span class="message-title">{{ item.accountTitle }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="消息(0)" name="second">
          <div class="message-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无消息</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="代办(0)" name="third">
          <div class="message-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无代办</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { workOrder } from "@/api/modules/order";
import { useUserStore } from "@/stores/modules/user";
import { decryption } from "@/utils/AESUtil";

const activeName = ref("first");
const messageTtem = ref([]);
const userStore = useUserStore();

const obj = JSON.parse(decryption("token", userStore.token));
const workList = async () => {
  const params = {
    pageNum: 1,
    pageSize: 10,
    branchId: obj.user.branchId
  };
  const {
    data: { list = [] }
  } = await workOrder(params);
  messageTtem.value = list;
};
workList();
</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}

.message-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;

  .message-item {
    padding: 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);
    width: 100%;
    &:last-child {
      border: none;
    }

    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }

    .message-content {
      display: flex;
      flex-direction: column;

      .message-title {
        margin-bottom: 5px;
      }

      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
