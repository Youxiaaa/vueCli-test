<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="row mt-3">
            <div class="col-md-7 mx-auto">
            <div class="d-flex justify-content-center h5 text-secondary" v-if="carts.length == 0">購物車目前是空的唷 還不知道要買什麼嗎？</div>
            <div class="d-flex justify-content-center" v-if="carts.length == 0"><router-link to="customerOrder2" class="h4 text-info">點這裡看看新品</router-link></div>
            <table class="table table-hover" v-if="carts.length > 0">
                <thead>
                    <tr>
                        <th width="100"></th>
                        <th>品名</th>
                        <th width="100">數量</th>
                        <th width="100">單價</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item , key) in carts" :key="key">
                        <td class="text-center">
                            <a href="#" class="text-danger" @click.prevent="delCart(item.id)">
                                <i class="far fa-trash-alt h5"></i>
                            </a>
                        </td>
                        <td>
                            <a href="#" class="d-block h6 text-secondary" @click.prevent="opencashModal(item)"> {{ item.product.title }}</a>
                            <div v-if="item.coupon">
                                <small class="text-success">已套用優惠券</small>
                            </div>
                        </td>
                        <td>
                            {{ item.qty }}
                        </td>
                        <td class="text-right">
                            {{ item.total | dollarSign}}
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="text-right">總計</td>
                        <td class="text-right h6"> {{ total | dollarSign }} </td>
                    </tr>
                    <tr v-if="final_total !== total">
                        <td colspan="3" class="text-right">折扣價</td>
                        <td class="text-right h5 text-danger"> {{ final_total | dollarSign }} </td>
                    </tr>
                </tfoot>
            </table>

            <div class="input-group mb-3" v-if="carts.length > 0">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="couponCode">
            <div class="input-group-append">
                <button class="btn btn-outline-primary" type="button" @click.prevent="addCoupon">套用優惠碼</button>
            </div>
            </div>
            <div class="text-right mt-4" v-if="carts.length > 0">
                <router-link to="checkOut" class="btn btn-primary btn-lg">結帳去</router-link>
            </div>
            </div>

            <div class="modal fade" id="cartCashModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">商品快照</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <img :src="cashCart.imageUrl" alt="" width="100%">
                    <h5 class="mt-3"> 品名 {{ cashCart.title }} </h5>
                    <h5 class="h6 text-secondary mt-3"> {{ cashCart.content }}</h5>
                    <h5 class="text-right h5"> 售價 <span class="text-danger"> {{ cashCart.price | dollarSign }} </span> 元</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary" data-dismiss="modal">關閉</button>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
export default {
    data() {
        return{
            carts : [],
            total : '',
            final_total : '',
            isLoading : false,
            cashCart : {},
            couponCode : ''
        }
    },
    methods : {
        updateCarts(){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/cart`
            self.isLoading = true;
            self.$http.get(api).then((res) => {
                if(res.data.success){
                        self.isLoading = false;
                        self.carts = res.data.data.carts;
                        self.total = res.data.data.total;
                        self.final_total = res.data.data.final_total;
                    }else{
                        console.log('error');
                    }
            })
        },
        delCart(id){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/cart/${id}`;
            self.isLoading = true;
            self.$http.delete(api).then((res) => {
                if(res.data.success){
                    self.updateCarts();
                }else{
                    alert('刪除商品失敗');
                }
            })
        },
        opencashModal(item){
            const self = this;
            self.cashCart = Object.assign({} , item.product);
            $('#cartCashModal').modal('show');
        },
        addCoupon(){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/coupon`;
            const coupon = {
                code : self.couponCode
            };
            self.isLoading = true;
            self.$http.post(api , {data : coupon}).then((res) => {
                if(res.data.success){
                    self.isLoading = false;
                    self.couponCode = '';
                    self.updateCarts();
                }else{
                    alert(res.data.message);
                    self.isLoading = false;
                }
            })
        }
    },
    created(){
        this.updateCarts();
    }
}
</script>