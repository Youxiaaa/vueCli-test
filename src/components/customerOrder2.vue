<template>
    <div>
        <loading :active.sync="isLoading"></loading>

        <div class="row">
        <div class="col-md-4 mb-4 mt-3 productCard" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
            <div style="height: 150px; background-size: cover; background-position: center" :style="{'backgroundImage' : `url(${item.imageUrl})`}"></div>
            <div class="card-body">
            <span class="badge badge-secondary float-right ml-2"> {{ item.category }} </span>
            <h5 class="card-title">
                <a href="#" class="text-dark"> {{ item.title }} </a>
            </h5>
            <p class="card-text"> {{ item.content }} </p>
            <div class="d-flex justify-content-between align-items-baseline">
                <!-- <div class="h5">2,800 元</div> -->
                <del class="h6">原價 {{ item.origin_price }} 元</del>
                <div class="h5">現在只要 <span class="text-danger">{{ item.price }}</span> 元</div>
            </div>
            </div>
            <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click.prevent="openproductModal(item)">
                <i class="fas fa-spinner fa-spin" v-if="loadingItem === item.id"></i>
                查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click.prevent="addtoCart(item.id)">
                <i class="fas fa-spinner fa-spin" v-if="cartLoading === item.id"></i>
                加到購物車
            </button>
            </div>
        </div>
        </div>
        </div>

        <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"> {{ product.title }} </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <img :src="product.imageUrl" alt="" width="100%">
                <h5 class="mt-3"> {{ product.content }} </h5>
                <div class="d-flex justify-content-between align-items-baseline">
                <del class="h6">原價 {{ product.origin_price }} 元</del>
                <div class="h5">現在只要 <span class="text-danger">{{ product.price }}</span> 元</div>
                </div>

                <select name="" id="" class="form-control mt-2" v-model="product.num">
                    <option :value="num" v-for="num in 5" :key="num.id"> 選購 {{ num }} {{ product.unit }} </option>
                </select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">關閉</button>
                <button type="button" class="btn btn-primary" @click.prevent="addtoCart(product.id , product.num)">
                    <i class="fas fa-spinner fa-spin" v-if="cartLoading === product.id"></i>
                    加入購物車
                </button>
            </div>
            </div>
        </div>
        </div>

    </div>
</template>
<script>
import $ from 'jquery';
export default {
    data(){
        return {
            products : [],
            product : {},
            isLoading : false,
            loadingItem : '',
            cartLoading : ''
        }
    },
    methods : {
        getProducts(page = 1){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/products?page=${page}`;
            self.isLoading = true;
            self.$http.get(api).then((res) => {
                switch(res.data.success){
                    case (res.data.success === true) :
                        self.products = res.data.products;
                        self.isLoading = false;
                        break;
                    default :
                        console.log('error');
                        self.isLoading = false;
                        break;
                }
            })
        },
        openproductModal(item){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/product/${item.id}`;
            self.loadingItem = item.id;
            self.$http.get(api).then((res) => {
                switch(res.data.success){
                    case (res.data.success === true) :
                        self.product = res.data.product;
                        self.loadingItem = '';
                        $('#productModal').modal('show');
                        break;
                    default :
                        console.log('error');
                        self.loadingItem = '';
                        break;
                }
            })
        },
        addtoCart(id , qty = 1){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/cart`;
            const cart = {
                product_id : id,
                qty
            };
            self.cartLoading = id;
            self.$http.post(api , {data : cart}).then((res) => {
                switch(res.data.success){
                    case (res.data.success === true) :
                        self.cartLoading = '';
                        $('#productModal').modal('hide');
                        alert(res.data.message);
                        break;
                    default :
                        console.log('error');
                        break;
                }
            })
        }
    },
    created(){
        this.getProducts();
    }
}
</script>