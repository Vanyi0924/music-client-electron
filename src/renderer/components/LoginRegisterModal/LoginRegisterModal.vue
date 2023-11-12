<template>
  <div class="login-register-modal">
    <a-modal
      v-model:open="accountStore.loginRegisterModal.visible"
      :title="isLogin ? `登录` : `注册`"
      :width="380"
      :footer="null"
      @ok="handleOk"
    >
      <a-form
        :model="formdata"
        name="normal_login"
        class="login-form"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item name="email" :rules="[]">
          <a-input v-model:value="formdata.email" placeholder="邮箱">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item v-if="isLogin" name="password" :rules="[]">
          <a-input-password
            v-model:value="formdata.password"
            placeholder="密码"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item v-else name="code" :rules="[]">
          <a-input-search
            v-model:value="formdata.code"
            placeholder="验证码"
            @search="getCaptcha"
          >
            <template #enterButton>
              <a-button>获取验证码</a-button>
            </template>
          </a-input-search>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            :loading="loading"
            class="login-form-button w-full"
            @click="handleSubmit"
          >
            {{ isLogin ? "登录" : "注册" }}
          </a-button>
          <div class="text-right">
            <p v-show="!isLogin" class="text-[12px]">
              已有账号？去<a-button
                class="-ml-3 text-[12px]"
                type="link"
                @click="accountStore.loginRegisterModal.isLogin = true"
                >登录</a-button
              >
            </p>
            <p v-show="isLogin" class="text-[12px]">
              没有账号？去<a-button
                class="-ml-3 text-[12px]"
                type="link"
                @click="accountStore.loginRegisterModal.isLogin = false"
                >注册</a-button
              >
            </p>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useAccountStore } from "@/stores/account";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { getEmailCaptcha, login, register } from "@/http/api";
import { ResponseCode } from "@/enums/ResponseCode";

const accountStore = useAccountStore();

const loading = ref<boolean | { delay: number }>(false);

const isLogin = computed(() => accountStore.loginRegisterModal.isLogin);

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const formdata = reactive({
  email: "",
  code: "",
  password: "",
});

const resetFormdata = () => {
  formdata.email = "";
  formdata.code = "";
  formdata.password = "";
};

watch(
  () => accountStore.loginRegisterModal.visible,
  (newVal) => {
    if (!newVal) {
      resetFormdata();
    }
  }
);

const handleSubmit = async () => {
  loading.value = { delay: 200 };
  if (isLogin.value) {
    const { data, code } = await login(formdata.email, formdata.password);
    if (code === ResponseCode.SUCCESS) {
      accountStore.setUser({
        email: formdata.email,
        token: data,
      });

      accountStore.loginRegisterModal.visible = false;
    }
  } else {
    await register(formdata.email, formdata.code);
  }
  loading.value = false;
};

const handleOk = () => {
  console.log(formdata);
};

const getCaptcha = () => {
  getEmailCaptcha(formdata.email);
};
</script>
