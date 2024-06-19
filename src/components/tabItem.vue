<template>
    <div class="tabs__content" v-show="selectedTitle === title">
        <slot></slot>
    </div>
</template>

<script>
import { inject } from 'vue';

export default {
    props: ['title'],
    setup() {
        const selectedTitle = inject('selectedTitle');

        return {
            selectedTitle,
        };
    },
};
</script>
<style scoped>
.tab__content {
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.05);
}
</style>
