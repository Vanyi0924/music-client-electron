<template>
  <div class="login-register-modal">
    <a-modal
      v-model:open="accountStore.loginRegisterModal.visible"
      :title="isLogin ? `登录` : `注册`"
      :width="380"
      :footer="null"
    >
      <a-form
        :model="formdata"
        ref="formRef"
        name="normal_login"
        class="login-form"
        :rules="rules"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item name="email">
          <a-input v-model:value="formdata.email" placeholder="邮箱">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item v-if="!isLogin" name="code">
          <a-input-search
            v-model:value="formdata.code"
            placeholder="验证码"
            @search="getCaptcha"
          >
            <template #enterButton>
              <a-button v-if="!counting">获取验证码</a-button>
              <a-button :disabled="counting" v-else
                ><i class="inline-block w-6 text-xs">{{ timeCount }}s</i
                >重新获取</a-button
              >
            </template>
          </a-input-search>
        </a-form-item>

        <a-form-item name="password">
          <a-input-password
            v-model:value="formdata.password"
            placeholder="6~12位大小写字母和数字密码"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="password2" has-feedback>
          <a-input
            v-model:value="formdata.password2"
            type="password"
            placeholder="再次确认密码"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input>
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
import { Rule } from "ant-design-vue/es/form";
import { useCountdown } from "@/utils/composable-fn";
import { NamePath } from "ant-design-vue/es/form/interface";
import { message } from "ant-design-vue";
import { passwordRE } from "@/utils/regexp";

const { timeCount, start, counting, reset } = useCountdown();

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
  password2: "",
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
      formRef.value.resetFields();
    }
  }
);

const formRef = ref();

const validFrom = async (nameList?: NamePath[]): Promise<boolean> => {
  try {
    const result = await formRef.value.validate(nameList);
    return result;
  } catch (err) {
    console.log("err", err);
    return false;
  }
};

const handleLogin = async () => {
  const { data, code } = await login(formdata.email, formdata.password);
  if (code === ResponseCode.SUCCESS) {
    accountStore.setUser({
      email: formdata.email,
      token: data,
    });

    accountStore.loginRegisterModal.visible = false;
  }
};

const handleSubmit = async () => {
  if (!(await validFrom())) return;
  loading.value = { delay: 200 };
  if (isLogin.value) {
    await handleLogin();
  } else {
    const { code } = await register(
      formdata.email,
      formdata.code,
      formdata.password
    );

    if (code === ResponseCode.SUCCESS) {
      // 注册成功自动登录
      await handleLogin();
      message.success("注册成功");
    }
  }
  loading.value = false;
};

const getCaptcha = async () => {
  if (!(await validFrom(["email"]))) {
    return;
  }
  start();
  const { code } = await getEmailCaptcha(formdata.email);

  if (code === ResponseCode.SUCCESS) {
    message.success("邮件已发送！");
  } else {
    reset();
  }
};

const validatePass = async (_rule: Rule, value: string) => {
  if (!passwordRE.test(formdata.password)) {
    return Promise.reject("请输入6~12位大小写字母和数字密码");
  } else {
    return Promise.resolve();
  }
};
const validatePass2 = async (_rule: Rule, value: string) => {
  if (value !== formdata.password) {
    return Promise.reject("两次密码不一致");
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { validator: validatePass, trigger: "blur" },
  ],
  password2: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    { validator: validatePass2, trigger: "change" },
  ],
  code: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { min: 4, max: 4, message: "请输入正确的验证码", trigger: "blur" },
  ],
};
</script>
