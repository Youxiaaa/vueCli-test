<template>
    <div>
        <form>
        <validation-provider rules="required|email" v-slot="{ errors }">
        <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" name="email" v-model="checkoutData.user.email"
            class="form-control">
        <span>{‌{ errors[0] }}</span>
        </div>
        </validation-provider>
        </form>
        <div class="row d-flex justify-content-center">
            <div class="col-md-6 mt-3">
                <form>
                <div class="form-group">
                    <label for="emailValue">收件人電子信箱</label>
                    <input type="email" class="form-control" id="emailValue" v-model="checkoutData.user.email">
                </div>
                <div class="form-group">
                    <label for="nameValue">收件人姓名</label>
                    <input type="text" class="form-control" id="nameValue" v-model="checkoutData.user.name">
                </div>
                <div class="form-group">
                    <label for="telValue">收件人電話</label>
                    <input type="tel" class="form-control" id="telValue" v-model="checkoutData.user.tel">
                </div>
                <div class="form-group">
                    <label for="addressValue">收件人地址</label>
                    <input type="text" class="form-control" id="addressValue" v-model="checkoutData.user.address">
                </div>
                <div class="form-group">
                    <label for="textArea">留言</label>
                    <br>
                    <div>
                        <textarea name="textArea" id="textArea" cols="30" rows="10" v-model="checkoutData.message"></textarea>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            checkoutData : {
                user : {
                    name : '',
                    email : '',
                    tel : '',
                    address : ''
                },
                message : ''
            }
        }
    },
    methods : {
        checkOut(){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/order`;
        }
    }
}
</script>