<template>
    <div>
    <navBar></navBar>
    <div class="container-fluid">
    <div class="row">
        <sideBar></sideBar>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <router-view></router-view>
        </main>
    </div>
    </div>
    </div>
</template>

<script>
import navBar from './navBar';
import sideBar from './sideBar';

export default {
    components : {
        navBar,
        sideBar
    },
    created(){
        const myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)youxiaaaToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        this.$http.defaults.headers.common.Authorization = myCookie;
    }
}
</script>