<template>
    <header id="page-topbar">
        <div class="navbar-header">
            <div class="d-flex">
                <!-- LOGO -->
                <div class="navbar-brand-box">
                    <router-link to="/" class="logo">
                        <!-- <span class="logo-sm" v-if="themeName === 'phl'">
                            <img class="img-sm" src="@/assets/images/phl_logo.png" alt height="32" />
                        </span>                       -->
                    </router-link>
                </div>
                <button
                    @click="toggleMenu"
                    type="button"
                    class="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn"
                    id="vertical-menu-btn"
                >
                    <i class="fa fa-fw fa-bars"></i>
                </button>

                <!-- App Search-->
                <form class="app-search d-none d-lg-block">
                    <div class="position-relative">
                        <!--  <input
              type="text"
              class="form-control"
              :placeholder="$t('navbar.search.text')"
            />
            <span class="uil-search"></span> -->
                    </div>
                </form>
            </div>

            <div class="d-flex align-items-center">
                <b-dropdown
                    variant="white"
                    class="d-inline-block d-lg-none ms-2 btn-search"
                    toggle-class="header-item noti-icon"
                    right
                    menu-class="dropdown-menu-lg p-0 dropdown-menu-end"
                >
                    <!-- <template v-slot:button-content>
                        <i class="uil-search"></i>
                    </template> -->
                    <form class="p-3">
                        <div class="form-group m-0">
                            <div class="input-group">
                                <input
                                    type="text"
                                    class="form-control"
                                    :placeholder="$t('navbar.search.text')"
                                    aria-label="Recipient's username"
                                />
                                <div class="input-group-append d-flex">
                                    <button class="btn btn-primary" type="submit">
                                        <i class="mdi mdi-magnify"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </b-dropdown>
              
                <!-- <div class="dropdown d-none d-lg-inline-block ms-1">
                    <router-link class="dropdown-item" to="/clients/phone-book">
                        <i class="uil uil-phone font-size-18 align-middle me-1 text-muted"></i>
                    </router-link>
                </div> -->

                <div class="dropdown d-none d-lg-inline-block ms-1">
                    <button type="button" class="btn header-item noti-icon waves-effect" data-toggle="fullscreen" @click="initFullScreen">
                        <i class="uil-minus-path"></i>
                    </button>
                </div>
            

                <b-dropdown class="d-inline-block" toggle-class="header-item" right variant="white" menu-class="dropdown-menu-end">
                    <template v-slot:button-content>
                        <vue-gravatar :email="userEmail" :size="30" class="rounded-circle header-profile-user" />
                        <span class="d-none d-xl-inline-block ms-1 fw-medium font-size-15">{{ userName }}</span>
                        <i class="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
                    </template>

                    <!-- item-->
                    <router-link class="dropdown-item" to="/profile">
                        <i class="uil uil-user-circle font-size-18 align-middle text-muted me-1"></i>
                        <span class="align-middle">{{ $t('navbar.dropdown.user.list.profile') }}</span>
                    </router-link>
                    <router-link class="dropdown-item" to="/profile/change-password">
                        <i class="uil uil-lock font-size-18 align-middle text-muted me-1"></i>
                        <span class="align-middle">{{ $t('navbar.dropdown.user.list.changepassword') }}</span>
                    </router-link>                    
                    <!-- <a class="dropdown-item d-block" href="#">
            <i
              class="uil uil-cog font-size-18 align-middle me-1 text-muted"
            ></i>
            <span class="align-middle">{{
              $t("navbar.dropdown.user.list.settings")
            }}</span>
            <span class="badge bg-soft-success rounded-pill mt-1 ms-2">03</span>
          </a> -->
                    <router-link class="dropdown-item" data-testid="logout" to="/logout">
                        <i class="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>
                        <span class="align-middle">{{ $t('navbar.dropdown.user.list.logout') }}</span>
                    </router-link>
                </b-dropdown>
            </div>
        </div>
    </header>
</template>

<style lang="scss">
.green .uil-wifi,
.green.uil-clock {
    color: green;
}
.red .uil-wifi,
.red .uil-clock {
    color: red;
}
.select-tenant {
    ul[role='group'] {
        max-height: 215px;
        overflow: auto;
        li {
            button {
                font-size: 13px;
            }
        }
    }
    .dropdown-toggle {
        min-width: 170px;
    }
    .reset-tenants {
        display: flex;
        justify-content: flex-end;
        button {
            font-size: 13px;
            padding: 0 4px;
            margin-right: 10px;
        }
    }
    .dropdown-menu {
        border-top-left-radius: 2px;
        border-top-right-radius: 0;
        padding: 0;
        min-width: 350px;
        .dropdown-item {
            padding: 4px;
            &:hover,
            &:focus {
                background-color: white;
            }
            .p-tree {
                border: 0;
                font-size: 14px;
                padding: 10px;
                .p-tree-toggler {
                    margin-right: 0;
                    &:focus {
                        box-shadow: none !important;
                    }
                    .p-tree-toggler-icon {
                        font-size: 14px;
                    }
                }
                input {
                    padding: 4px 1.8rem 4px 4px;
                    font-size: 14px;
                }
                .p-treenode {
                    padding: 0;
                    margin: 5px;
                    .p-treenode-content {
                        box-shadow: none;
                        margin: 5px;
                    }
                }
            }
        }
    }
}
</style>

<script>
import { useStore } from 'vuex';
import { myStore } from './topbarUtil';
import _ from 'lodash';
import { mapState } from 'vuex';
import { onBeforeMount } from 'vue';

export default {
    components: {
  
    },
    data() {
        return {
            languages: [
                {
                    flag: require('@/assets/images/flags/us.jpg'),
                    language: 'en',
                    title: 'English',
                },
            ],

            current_language: 'en',
            text: null,
            flag: null,
            value: null,
            userName: '',
            myStore,
            userEmail: 'default.user@gmail.com',     
        };
    },

    computed: {
        themeName() {
            return this.$themeName;
        },

    },
    async beforeMount()
    {   

    },
    async mounted() {
        
        //this.store = useStore();
        //this.value = this.languages.find(x => x.language === this.$i18n.locale);
        //this.text = this.value.title;
        //this.flag = this.value.flag;
       

    },
    unmounted() {
  
    },
    methods: {
        /**
         * Toggle menu
         */
        toggleMenu() {
            document.querySelector('body').classList.toggle('sidebar-enable');
            this.$parent.toggleMenu();
        },
        initFullScreen() {
            document.body.classList.toggle('fullscreen-enable');
            if (
                !document.fullscreenElement &&
                /* alternative standard method */
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement
            ) {
                // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        },
        /**
         * Set languages
         */
        setLanguage(locale, country, flag) {
            this.$i18n.locale = locale;
            this.current_language = locale;
            this.text = country;
            this.flag = flag;
        },
        logoutUser() {
            // this.logout();
            // this.$router.go('/account/login');
        },
       
    },
};
</script>
