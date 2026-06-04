<script setup>
import '../css/accountResModal.css'

import { ref, watch } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:isVisible', 'register']);

const form = ref({
  username: '',
  email: '',
  name: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

// 當彈窗關閉時自動清空表單
watch(() => props.isVisible, (newVal) => {
  if (!newVal) {
    form.value = { username: '', email: '', name: '', phone: '', password: '', confirmPassword: '' };
  }
});

const closeModal = () => {
  emit('update:isVisible', false);
};

const handleRegister = () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('兩次輸入的密碼不一致，請重新確認！');
    return;
  }
  emit('register', { ...form.value });
};
</script>
<template>
  <Teleport to="body">
    <div class="acc-res-modal-overlay" v-if="isVisible" @click.self="closeModal">
      <div class="acc-res-modal-content">
        <h2>新使用者註冊</h2>
        <form @submit.prevent="handleRegister">
          <div class="acc-res-form-group">
            <label for="username">帳號</label>
            <input type="text" id="username" v-model="form.username" required placeholder="請輸入帳號" />
          </div>
          <div class="acc-res-form-group">
            <label for="email">電子郵件</label>
            <input type="email" id="email" v-model="form.email" required placeholder="請輸入電子郵件" />
          </div>
          <div class="acc-res-form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" v-model="form.name" required placeholder="請輸入姓名" />
          </div>
          <div class="acc-res-form-group">
            <label for="phone">連絡電話</label>
            <input type="tel" id="phone" v-model="form.phone" required placeholder="請輸入連絡電話" />
          </div>
          <div class="acc-res-form-group">
            <label for="password">密碼</label>
            <input type="password" id="password" v-model="form.password" required placeholder="請輸入密碼" />
          </div>
          <div class="acc-res-form-group">
            <label for="confirmPassword">確認密碼</label>
            <input type="password" id="confirmPassword" v-model="form.confirmPassword" required placeholder="請再次輸入密碼" />
          </div>
          <div class="acc-res-modal-actions">
            <button type="button" class="acc-res-btn-cancel" @click="closeModal">取消</button>
            <button type="submit" class="acc-res-btn-submit">註冊</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

\
