<script>
import router from '@/router';
import { layoutComputed } from '@/state/helpers';
import { Icon } from '@iconify/vue';

import Topbar from '@/components/topbar';
import Sidebar from '@/components/side-bar';
import Footer from '@/components/footer';

import('../../assets/scss/theme.scss');

export default {
    data() {
        return {
            isMenuCondensed: false,
        };
    },
    components: {
        Topbar,
        Sidebar,
        Footer,
        Icon,
    },
    computed: {
        ...layoutComputed,
    },
    name: 'vertical',
    created() {
        document.body.removeAttribute('data-layout');
        document.body.removeAttribute('data-topbar');
    },
    methods: {
        toggleMenu() {
            if (window.screen.width >= 992) {
                // eslint-disable-next-line no-unused-vars
                router.afterEach((routeTo, routeFrom) => {
                    document.body.classList.remove('sidebar-enable');
                    document.body.classList.remove('vertical-collpsed');
                });
                document.body.classList.toggle('vertical-collpsed');
            } else {
                // eslint-disable-next-line no-unused-vars
                router.afterEach((routeTo, routeFrom) => {
                    document.body.classList.remove('sidebar-enable');
                });
                document.body.classList.remove('vertical-collpsed');
            }
            this.isMenuCondensed = !this.isMenuCondensed;
        },
    },
    mounted: function () {
        if (this.isMenuCondensed == true && window.screen.width >= 992) {
            // eslint-disable-next-line no-unused-vars
            router.afterEach((routeTo, routeFrom) => {
                document.body.classList.remove('sidebar-enable');
                document.body.classList.remove('vertical-collpsed');
            });
            document.body.classList.toggle('vertical-collpsed');
        }
    },
};
</script>

<template>
    <!-- Begin page -->
    <div id="layout-wrapper" :class="$themeName">
        <Topbar />
        <Sidebar
            :isCondensed="isMenuCondensed"
            :type="leftSidebarType"
            :width="layoutWidth"
        />
        <!-- ============================================================== -->
        <!-- Start right Content here -->
        <!-- ============================================================== -->
        <div class="main-content">
            <div class="page-content" id="main-page-content">
                <div class="container-fluid" id="main-container-fluid">
                    <slot />
                
                </div>
            </div>
            <!-- End Page-content -->
            <Footer />
        </div>
        <!-- end main content-->
    </div>
</template>
