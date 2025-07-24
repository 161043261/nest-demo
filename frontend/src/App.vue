<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import api, { type ICond, type IPeople, type IEmail } from './api';

const username = ref('');
const password = ref('');
const captcha = ref('');

const handleLogin = () => {
  fetch('/api/v1/user/create', {
    method: 'POST',
    body: JSON.stringify({
      username: username.value,
      password: password.value,
      captcha: captcha.value,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
};

const captchaSvg = ref('');

const fetchCaptchaSvg = () =>
  fetch('/api/v1/user/getCaptcha').then((res) => res.text());

const refreshCaptcha = () => {
  fetchCaptchaSvg().then((res) => (captchaSvg.value = res));
};

onMounted(() => {
  fetchCaptchaSvg().then((res) => (captchaSvg.value = res));
});

const fileRef = ref<HTMLInputElement | null>(null);

const handleUpload = () => {
  if (!fileRef.value || !fileRef.value.files) {
    return;
  }
  const formData = new FormData();
  formData.append(
    'fileEntity', // fieldName
    fileRef.value.files[0],
  );

  fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then(console.log);
};

const fnameWithExt = ref('');

const handleDownloadStream = async () => {
  console.log(
    '[handleDownloadStream] url:',
    `/api/upload/stream/${fnameWithExt.value}`,
  );

  const buf = await fetch(`/api/upload/stream/${fnameWithExt.value}`).then(
    (res) => res.arrayBuffer(),
  );
  const blob = new Blob([buf]);
  const url = URL.createObjectURL(blob);
  const aTag = document.createElement('a');
  aTag.href = url;
  aTag.download = 'example.jpg';
  aTag.click();
};

// ===============================================

const peopleTotal = ref<number>(0);
const peopleList = ref<IPeople[]>([]);

const peopleFormData = reactive<IPeople>({
  id: 0,
  name: 'whoami',
  age: 23,
});

const condFormData = reactive<ICond>({
  partialName: '',
  page: 1,
  pageSize: 10,
});

const emailFormData = reactive<IEmail>({
  peopleId: 0,
  addr: '',
});

const insertPeople = async () => {
  await api.insertPeople(peopleFormData);
  resetPeopleFormData();
  await fetchPeopleList();
};

const updatePeople = async () => {
  await api.updatePeople(peopleFormData);
  resetPeopleFormData();
  await fetchPeopleList();
};

const deletePeople = async (id: number) => {
  await Promise.all([api.deletePeople(id), fetchPeopleList()]);
};

const resetPeopleFormData = () => {
  peopleFormData.id = 0;
  peopleFormData.age = 23;
  peopleFormData.name = 'whoami';
};

const resetCondFormData = () => {
  condFormData.partialName = '';
  condFormData.page = 1;
  condFormData.pageSize = 10;
  fetchPeopleList();
};

const resetEmailFormData = () => {
  emailFormData.peopleId = 0;
  emailFormData.addr = '';
};

const addPeopleEmail = async () => {
  await api.addPeopleEmail(emailFormData);
  resetEmailFormData();
  await fetchPeopleList();
};

const fetchPeopleList = async () => {
  const res = (await api.fetchPeopleList(condFormData)).data as {
    list: IPeople[];
    total: number;
  };
  peopleList.value = (res?.list ?? []) as IPeople[];
  peopleTotal.value = res?.total ?? 0;
};

const allEmailAddrList = computed(() => {
  const all = [];
  for (const people of peopleList.value) {
    const emailAddrList = people.emailList?.map((item) => item.addr);
    if (emailAddrList) {
      all.push(...emailAddrList);
    }
  }
  return all;
});

const emailAddr = ref<string>('<emailAddr>');
const emailAddr2 = ref<string>('<emailAddr2>');

const swapEmailAddr = async () => {
  await api.swapEmailAddr([emailAddr.value, emailAddr2.value]);
  emailAddr.value = '<emailAddr>';
  emailAddr2.value = '<emailAddr2>';
  await fetchPeopleList();
};

fetchPeopleList();
</script>

<template>
  <div>username</div>
  <input placeholder="username" v-model="username" />

  <div>password</div>
  <input placeholder="password" v-model="password" />

  <div>captcha</div>
  <input placeholder="captcha" v-model="captcha" />

  <div v-html="captchaSvg" @click="refreshCaptcha"></div>

  <button @click="handleLogin">login</button>

  <hr />

  <input type="file" ref="fileRef" />
  <button @click="handleUpload">upload</button>

  <hr />

  <div>fnameWithExt</div>
  <input placeholder="fnameWithExt" v-model="fnameWithExt" />
  <button @click="handleDownloadStream">handleDownloadStream</button>

  <hr />
  <div>peopleTotal: {{ peopleTotal }}</div>
  <ul v-if="peopleList.length">
    <li v-for="{ id, name, age, emailList } of peopleList">
      <div>id: {{ id }}, name: {{ name }}, age: {{ age }}</div>

      <div>emailList</div>
      <ol v-if="emailList && emailList.length">
        <li v-for="{ addr } of emailList">{{ addr }}</li>
      </ol>
      <div v-else>&lt;Empty emailList&gt;</div>

      <button @click="deletePeople(id)">deletePeople {{ id }}</button>
    </li>
  </ul>
  <div v-else>&lt;Empty peopleList&gt;</div>

  <hr />

  <div>id</div>
  <input placeholder="id" v-model="peopleFormData.id" type="number" />

  <div>name</div>
  <input placeholder="name" v-model="peopleFormData.name" />

  <div>age</div>
  <input placeholder="age" v-model="peopleFormData.age" type="number" />

  <button @click="insertPeople">insertPeople</button>
  <button @click="updatePeople">updatePeople</button>

  <hr />

  <div>partialName</div>
  <input placeholder="partialName" v-model="condFormData.partialName" />

  <div>page</div>
  <input placeholder="page" v-model="condFormData.page" type="number" />

  <div>pageSize</div>
  <input placeholder="pageSize" v-model="condFormData.pageSize" type="number" />

  <button @click="fetchPeopleList">fetchPeopleList</button>
  <button @click="resetCondFormData">resetCondFormData</button>

  <hr />

  <div>peopleId</div>
  <input
    placeholder="peopleId"
    v-model="emailFormData.peopleId"
    type="number"
  />

  <div>content</div>
  <input placeholder="content" v-model="emailFormData.addr" />

  <button @click="addPeopleEmail">addPeopleEmail</button>

  <hr />

  <div>emailAddr</div>
  <select v-model="emailAddr">
    <option v-for="addr of allEmailAddrList">{{ addr }}</option>
  </select>

  <div>emailAddr2</div>
  <select v-model="emailAddr2">
    <option v-for="addr of allEmailAddrList">{{ addr }}</option>
  </select>

  <button @click="swapEmailAddr">
    swapEmailAddr {{ emailAddr }}, {{ emailAddr2 }}
  </button>
</template>
