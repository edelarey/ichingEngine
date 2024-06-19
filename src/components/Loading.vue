<template>
    <div :class="classObject" class="loading-wrapper">
        <b-spinner :variant="variant"></b-spinner>
        <div class="ms-2">{{ message }}</div>
    </div>
</template>

<script>
/**
 * Example props:
 *    message: 'Loading...'
 *    variant: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
 *    position: 'left', 'center', 'right'
 */
import { computed } from 'vue';

export default {
    props: {
        message: {
            type: String,
            default: 'Loading...',
        },
        variant: {
            type: String,
            default: 'primary',
        },
        position: {
            type: String,
            default: 'center',
        },
    },
    setup(props) {
        const classObject = computed(() => {
            return {
                'd-flex': true,
                'align-items-center': true,
                'mb-4': true,
                'justify-content-start': props.position === 'start',
                'justify-content-center': props.position === 'center',
                'justify-content-end': props.position === 'end',
            };
        });

        return {
            classObject,
        };
    },
};
</script>
