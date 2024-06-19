<template>
    <div class="card-header">
        <h4 class="card-title">{{ tabTitle }}</h4>
    </div>
    <ul class="nav nav-bar">
        <li
            v-for="title in tabTitles"
            :key="title"
            class="tabs__item"
            :class="{ selected: selectedTitle === title }"
            @click="selectedTitle = title"
        >
            {{ title }}
        </li>
    </ul>

    <slot></slot>
</template>

<script>
import { ref, provide } from 'vue';

export default {
    props: {
        tabTitle: String,
    },
    setup(props, { slots }) {
        const tabTitles = ref(slots.default().map(tab => tab.props.title));
        const selectedTitle = ref(tabTitles.value[0]);

        provide('selectedTitle', selectedTitle);
        return {
            selectedTitle,
            tabTitles,
        };
    },
};
</script>

<style>
.tabs {
    max-width: 60vw;
    /*margin: 0 auto;*/
}
.tabs__header {
    list-style: none;
    padding: 0.9rem;
    margin: 1rem;
    display: flex;
    justify-content: space-between;
    gap: 5px;
    cursor: default;
    transition: 0.4s all ease-out;
    font-weight: 500;
}
.tabs__item {
    flex: 1;
    background-color: #eee;
    padding: 0.5rem 0.5rem;
    border-radius: 5px 5px 0 0;
    transition: 0.4s all ease-out;
    user-select: none;
    font-weight: 500;
}
.tabs__item.selected {
    background-color: #34c38f;
    color: #fff;
}
.tabs__content {
    min-height: 300px;
    display: grid;
    place-items: relative;
    border-radius: 0 0 5px 5px;
    padding: 0px;
}
</style>
