<script setup>
import { ref, onMounted } from 'vue'
import userServices from '@/services/user.service.js'
import Btn from '@/components/common/Btn.vue'

const users = ref([])

onMounted(async () => {
    const res = await userServices.getUsers()
    if(res){
        users.value = res['hydra:member']
    }
})
</script>

<template>
    <div class="container" v-for="user in users" :key="user.id">
        <h3>{{ user.name }} {{ user.surname }}</h3>
        <p>{{ user.email }}</p>
        <p>{{ user.roles }}</p>
        <div class="actions">
            <Btn :type="'link'" :to="{ name: 'admin-user', params: { id: user.id } }">See or edit</Btn>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}
.actions {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
</style>