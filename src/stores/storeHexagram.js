// use pinia to store the last hexagram generated in consultation
// store only the binary string aspect of the hexagram

// Path: src/const/state.js
import {defineStore} from 'pinia';

export const useHexagramStore = defineStore('hexagram',{
      state: () => ({
        primaryHexagram: '111111',
        secondaryHexagram: '111111',
    }),
    getters: {
        getPrimaryHexagram() {
            return this.primaryHexagram;
        },
        getSecondaryHexagram() {
            return this.secondaryHexagram;
        },
    },
    actions: {
        setPrimaryHexagram(hexagram) {       
            this.primaryHexagram = hexagram;
        },
        setSecondaryHexagram(hexagram) {
            this.secondaryHexagram = hexagram;
        },
    },
});
