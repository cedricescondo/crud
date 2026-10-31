
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Manage Users</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>User Records</h2>

      <ion-button expand="block" @click="loadUsers">
        Refresh Users
      </ion-button>

      <p v-if="loading">Loading users...</p>

      <p v-if="error" class="ion-text-center">
        {{ error }}
      </p>

      <ion-card v-for="user in users" :key="user.id">
        <ion-card-header>
          <ion-card-title>
            {{ user.firstName }} {{ user.lastName }}
          </ion-card-title>
          <ion-card-subtitle>
            {{ user.email }}
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <p>Age: {{ user.age }}</p>

          <ion-button
            color="warning"
            size="small"
            @click="editUser(user)"
          >
            Edit
          </ion-button>

          <ion-button
            color="danger"
            size="small"
            @click="deleteUser(user.id)"
          >
            Delete
          </ion-button>
        </ion-card-content>
      </ion-card>

      <p v-if="!loading && users.length === 0">
        No users found.
      </p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/vue';

import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

import { db } from '../firebase';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

const users = ref<User[]>([]);
const loading = ref(false);
const error = ref('');

const loadUsers = async () => {
  loading.value = true;
  error.value = '';

  try {
    const snapshot = await getDocs(collection(db, 'users'));

    users.value = snapshot.docs.map(document => ({
      id: document.id,
      ...document.data()
    } as User));

  } catch (err) {
    console.error(err);
    error.value = 'Unable to load users from Firebase.';
  } finally {
    loading.value = false;
  }
};

const editUser = async (user: User) => {
  const firstName = window.prompt(
    'Enter First Name:',
    user.firstName
  );

  if (firstName === null) return;

  const lastName = window.prompt(
    'Enter Last Name:',
    user.lastName
  );

  if (lastName === null) return;

  const email = window.prompt(
    'Enter Email:',
    user.email
  );

  if (email === null) return;

  const ageInput = window.prompt(
    'Enter Age:',
    String(user.age)
  );

  if (ageInput === null) return;

  const age = Number(ageInput);

  if (
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !Number.isInteger(age) ||
    age < 1
  ) {
    alert('Please enter valid user information.');
    return;
  }

  try {
    await updateDoc(doc(db, 'users', user.id), {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      age: age
    });

    alert('User successfully updated!');
    await loadUsers();

  } catch (err) {
    console.error(err);
    alert('Failed to update user.');
  }
};

const deleteUser = async (id: string) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this user?'
  );

  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, 'users', id));

    alert('User successfully deleted!');
    await loadUsers();

  } catch (err) {
    console.error(err);
    alert('Failed to delete user.');
  }
};

onMounted(loadUsers);
</script>
