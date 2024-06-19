

<template>
  <div id="iChingEngine">
     <component :is="this.$route.meta.layout || 'div'">            
            <router-view />
        </component>
  </div>
</template>

<script>
import appConfig from '@/app.config';
import _ from 'lodash';

export default {
    name: 'iChingEngine',
    components: {
        
    },
    page: {
        // All subcomponent titles will be injected into this template.
        titleTemplate(title) {
            return title ? `${title} | ${appConfig.title}` : appConfig.title;
        },
    },
    data() {
        return {
        };
    },
    methods:{},
     mounted() {
    },
    destroyed() {},

}
</script>
