<template>
  <div class="hello">
    <div class="d-flex justify-content-center align-item-center">
      <button type="button" class="btn btn-primary text-white" @click.prevent="logOut">登出</button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  created () {
    const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/products`;
    this.$http.get(api).then((res) => console.log(res.data));
  },
  methods : {
    logOut(){
      const self = this;
      const api = `${process.env.APIPATH}/logout`;
      this.$http.post( api , null).then((res) => {
        alert(JSON.stringify(res.data.message));
        this.$router.push('/signin');
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
