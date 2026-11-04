
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Create User 1</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Add New User v2</h2>

      <form @submit.prevent="addUser">
        <ion-item>
          <ion-input
            v-model="firstName"
            label="First Name"
            label-placement="floating"
            required
          />
        </ion-item>

        <ion-item>
          <ion-input
            v-model="lastName"
            label="Last Name"
            label-placement="floating"
            required
          />
        </ion-item>

        <ion-item>
          <ion-input
            v-model="email"
            type="email"
            label="Email"
            label-placement="floating"
            required
          />
        </ion-item>

        <ion-item>
          <ion-input
            v-model="age"
            type="number"
            label="Age"
            label-placement="floating"
            required
          />
        </ion-item>

        <ion-button
          expand="block"
          type="submit"
          class="ion-margin-top"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Save User' }}
        </ion-button>
      </form>

      <ion-text color="success" v-if="message">
        <p>{{ message }}</p>
      </ion-text>

      <ion-text color="danger" v-if="error">
        <p>{{ error }}</p>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText
} from '@ionic/vue';

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const age = ref<number | null>(null);

const loading = ref(false);
const message = ref('');
const error = ref('');

const addUser = async () => {
  message.value = '';
  error.value = '';

  if (
    !firstName.value.trim() ||
    !lastName.value.trim() ||
    !email.value.trim() ||
    age.value === null ||
    age.value < 1
  ) {
    error.value = 'Please complete all fields correctly.';
    return;
  }

  loading.value = true;

  try {
    await addDoc(collection(db, 'users'), {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      age: Number(age.value),
      createdAt: new Date()
    });

    message.value = 'User successfully added to Firebase!';

    firstName.value = '';
    lastName.value = '';
    email.value = '';
    age.value = null;

  } catch (err) {
    console.error(err);
    error.value = 'Failed to save user. Check Firebase connection.';
  } finally {
    loading.value = false;
  }
};
</script>
