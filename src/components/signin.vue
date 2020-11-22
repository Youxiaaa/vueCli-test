<template>
    <div>
    <div class="container">
        <div class="row d-flex justify-content-center align-item-center">
            <div class="col-4 mt-5 text-center">
                <form class="form-signin" @submit.prevent="login">
                <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
                <label for="inputEmail" class="sr-only">Email address</label>
                <input type="email" id="inputEmail" v-model="user.username" class="form-control" placeholder="Email address" required autofocus>
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" v-model="user.password" class="form-control" placeholder="Password" required>
                <div class="checkbox mb-3">
                <label>
                <input type="checkbox" value="remember-me"> Remember me
                </label>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                <p class="mt-5 mb-3 text-muted">&copy; 2017-2020</p>
                </form>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
        user : {
            username : '',
            password : ''
        }
        }
    },
    methods : {
        login(){
            const self = this;
            const api = `${process.env.APIPATH}/admin/signin`;
            this.$http.post( api , self.user ).then((res) => {
                if(res.data.success){
                    const token = res.data.token;
                    const expired = res.data.expired;
                    document.cookie = `youxiaaaToken=${ token }; expires=${ new Date(expired) };`;
                    this.$router.push('/admin/products');
                }else{
                    alert(res.data.message);
                }
            });
        }
    }
}
</script>