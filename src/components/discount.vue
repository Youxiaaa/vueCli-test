<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right mt-3">
            <button class="btn btn-primary" @click="openDiscountModal(true)">建立新的優惠券</button>
        </div>

        <table class="table table-hover mt-3">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th class="text-center" width="120">折扣百分比</th>
                    <th width="120">到期日</th>
                    <th width="100">是否啟用</th>
                    <th width="120" class="text-center">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item , key) in coupons" :key="key">
                    <td>
                        {{ item.title }}
                    </td>
                    <td class="text-center">
                        {{ item.percent }}%
                    </td>
                    <td>
                        {{ item.due_date | filterDate}}
                    </td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">已啟用</span>
                        <span v-else class="text-danger">未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" @click="openDiscountModal(false , item)">編輯</button>
                        <button class="btn btn-sm btn-danger" @click="openDelModal(item)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="d-flex justify-content-center">
        <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{'disabled' : !pagination.has_pre}">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent="getDiscount(pagination.current_page - 1)">
                <span aria-hidden="true">&laquo;</span>
            </a>
            </li>
            <li class="page-item" v-for="(page , key) in pagination.total_pages" :key="key" :class="{'active' : pagination.current_page == page}"><a class="page-link" href="#" @click.prevent="getDiscount(page)">{{ page }}</a></li>
            <li class="page-item" :class="{'disabled' : !pagination.has_next}">
            <a class="page-link" href="#" aria-label="Next" @click.prevent="getDiscount(pagination.current_page + 1)">
                <span aria-hidden="true">&raquo;</span>
            </a>
            </li>
        </ul>
        </nav>
        </div>

        <div class="modal fade" id="discountModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col">

                        <div class="form-group">
                        <label for="title">標題</label>
                        <input type="text" class="form-control" id="title"
                            placeholder="請輸入標題" v-model="tempCoupons.title">
                        </div>

                        <div class="form-group">
                        <label for="">優惠碼</label>
                        <input type="text" class="form-control"
                            placeholder="請輸入優惠碼" v-model="tempCoupons.code">
                        </div>

                        <div class="form-group">
                        <label for="date">到期日</label>
                        <input type="date" class="form-control" id="date" v-model="tempCoupons.due_date">
                        </div>

                        <div class="form-group">
                        <label for="percent">折扣百分比</label>
                        <input type="number" class="form-control" id="percent" v-model="tempCoupons.percent">
                        </div>

                        <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox"
                            id="is_enabled" :true-value="1" :flase-value="0" v-model="tempCoupons.is_enabled">
                            <label class="form-check-label" for="is_enabled">
                            是否啟用
                            </label>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">關閉</button>
                <button type="button" class="btn btn-primary" @click='updateDiscount'>更新優惠券</button>
            </div>
            </div>
        </div>
        </div>

        <div class="modal fade" id="delCouponsModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>刪除產品</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                是否刪除 <strong class="text-danger">{{ tempCoupons.title }}</strong> 折價券(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="delCoupons">確認刪除</button>
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
        return {
            isLoading : false,
            coupons : [],
            tempCoupons : {},
            pagination : {},
            isNew : false
        }
    },
    methods : {
        getDiscount(page = 1) {
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/coupons?page=${page}}`;
            self.isLoading = true;
            self.$http.get(api).then((res) => {
                self.isLoading = false;
                if(res.data.success){
                    self.coupons = res.data.coupons;
                    self.pagination = res.data.pagination;
                    console.log(res.data.pagination);
                }
            })
        },
        openDiscountModal(isNew , item){
            const self = this;
            if(isNew){
                self.tempCoupons = {};
                self.isNew = true;
            }else{
                self.tempCoupons = Object.assign({} , item);
                self.isNew = false;
            }
            $('#discountModal').modal('show');
        },
        openDelModal(item){
            const self = this;
            self.tempCoupons = Object.assign({} , item);
            $('#delCouponsModal').modal('show');
        },
        updateDiscount() {
            const self = this;
            const timestamp = Math.floor(new Date(self.tempCoupons.due_date) / 1000);
            self.tempCoupons.due_date = timestamp;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/coupon`;
            let httpMethods = 'post';
            if(!self.isNew){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/coupon/${self.tempCoupons.id}`;
                httpMethods = 'put';
            }
            self.isLoading = true;
            this.$http[httpMethods](api , {data : self.tempCoupons}).then((res) => {
                if(res.data.success){
                    $('#discountModal').modal('hide');
                    self.isLoading = false;
                    self.getDiscount();
                }else{
                    $('#discountModal').modal('hide');
                    self.isLoading = false;
                    alert('優惠券建立失敗');
                    self.getDiscount();
                }
            })
        },
        delCoupons(){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/coupon/${self.tempCoupons.id}`
            this.$http.delete(api).then((res) => {
                if(res.data.success){
                    alert(res.data.message);
                    $('#delCouponsModal').modal('hide');
                    self.getDiscount();
                }else{
                    alert(res.data.message);
                    $('#delCouponsModal').modal('hide');
                    self.getDiscount();
                }
            })
        }
    },
    created(){
        this.getDiscount();
    }
}
</script>