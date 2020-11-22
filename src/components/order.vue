<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        test 這裡是訂單列表
    </div>
</template>
<script>
export default {
    data (){
        return {
            isLoading : false
        }
    }
}
</script>