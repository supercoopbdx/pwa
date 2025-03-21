<script setup>

</script>

<template>
    <div class="page gap-10">
        <h1>{{ $t('nav.form') }}</h1>
        <form>
            <label for="number-input">{{ $t('form.barcode') }} :</label>
            <input type="number" id="number-input" required v-model="zone" />
        </form>
        <form>
            <label for="number-input">{{ $t('form.amount') }} :</label>
            <input type="number" id="number-input" required v-model="zone" />
        </form>

        <div class="flex flex-row gap-2 justify-between">
            <RouterLink to="/list">
                <button class="secondary">{{ $t('button.back') }}</button>
            </RouterLink>
            <RouterLink to="/list">
                <button class="primary">{{ $t('button.submit') }}</button>
            </RouterLink>
        </div>
    </div>
</template>
