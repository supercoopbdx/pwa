<script setup>

</script>

<template>
    <main class="page gap-10">
        <h1>{{ $t('nav.send') }}</h1>

        <p class="text-left m-auto mt-4 mb-30">{{ $t('send.confirmation') }}</p>

        <div class="flex flex-row gap-2 justify-between">
            <RouterLink to="/list">
                <button class="secondary">{{ $t('button.back') }}</button>
            </RouterLink>
            <RouterLink to="/">
                <button class="primary">{{ $t('button.send_confirm') }}</button>
            </RouterLink>
        </div>
    </main>
</template>
