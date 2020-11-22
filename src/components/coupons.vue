<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right mt-3">
            <button class="btn btn-primary" @click.prevent="openCouponModal(true)">建立新的折價券</button>
        </div>

        <table class="table table-hover mt-3">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th width="100">折扣百分比</th>
                    <th width="100">到期日</th>
                    <th width="100">是否啟用</th>
                    <th width="120">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(coupon , key) in coupons" :key="key">
                    <td> {{ coupon.title }} </td>
                    <td class="text-center"> {{ coupon.percent }}% </td>
                    <td> {{ coupon.due_date | filterDate}} </td>
                    <td class="text-center">
                        <span v-if="coupon.is_enabled" class="text-success">
                            已啟用
                        </span>
                            
                        <span v-if="!coupon.is_enabled" class="text-danger">
                            未啟用
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" @click.prevent="openCouponModal(false , coupon)">編輯</button>
                        <button class="btn btn-sm btn-outline-danger" @click.prevent="openDelModal(coupon)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="d-flex justify-content-center">
        <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{'disabled' : !pagination.has_pre}">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent="getCoupons(pagination.current_page - 1)">
                <span aria-hidden="true">&laquo;</span>
            </a>
            </li>
            <li class="page-item" v-for="(page , key) in pagination.total_pages" :key="key" :class="{'active' : pagination.current_page == page}"><a class="page-link" href="#" @click.prevent="getCoupons(page)"> {{ page }} </a></li>
            <li class="page-item" :class="{'disabled' : !pagination.has_next}">
            <a class="page-link" href="#" aria-label="Next" @click.prevent="getCoupons(pagination.current_page + 1)">
                <span aria-hidden="true">&raquo;</span>
            </a>
            </li>
        </ul>
        </nav>
        </div>

        <div class="modal fade" id="couponModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="title">名稱</label>
                    <input type="text" id="title" placeholder="請輸入名稱" class="form-control" v-model="tempCoupon.title">
                </div>
                <div class="form-group">
                    <label for="code">優惠碼</label>
                    <input type="text" id="code" placeholder="請輸入優惠碼" class="form-control" v-model="tempCoupon.code">
                </div>
                <div class="form-group">
                    <label for="date">到期日</label>
                    <input type="date" id="date" class="form-control" v-model="tempCoupon.due_date">
                </div>
                <div class="form-group">
                    <label for="percent">折扣百分比</label>
                    <input type="number" id="percent" class="form-control" v-model="tempCoupon.percent">
                </div>
                <div class="form-group">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox"
                    id="is_enabled" :true-value="1" :flase-value="0" v-model="tempCoupon.is_enabled">
                    <label class="form-check-label" for="is_enabled">
                    是否啟用
                    </label>
                </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" @click.prevent="updateCoupons">儲存優惠券</button>
            </div>
            </div>
        </div>
        </div>

        <div class="modal fade" id="delModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header bg-danger">
                <h5 class="modal-title text-white" id="exampleModalLabel">刪除折價券</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <h5 class="h5">確定刪除 <span class="text-danger h4"> {{ tempCoupon.title }} </span> 折價券嗎?(刪除後將無法恢復！！)</h5>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click.prevent="delCoupon(tempCoupon)">刪除</button>
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
            coupons : [],
            tempCoupon : {},
            isNew : false,
            isLoading : false,
            pagination : {}
        }
    },
    methods : {
        getCoupons(page = 1){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/coupons?page=${page}`
            self.isLoading = true;
            this.$http.get(api).then((res) => {
                if(res.data.success){
                    self.isLoading = false;
                    self.coupons = res.data.coupons;
                    self.pagination = res.data.pagination;
                }else{
                    self.isLoading = false;
                    alert('優惠券資料讀取失敗');
                }
            })
        },
        openCouponModal(isNew , coupon){
            const self = this;
            if(isNew){
                self.tempCoupon = {};
                self.isNew = true;
            }else{
                self.tempCoupon = Object.assign({} , coupon);
                self.isNew = false;
            }
            $('#couponModal').modal('show');
        },
        openDelModal(coupon){
            const self = this;
            self.tempCoupon = Object.assign({} , coupon);
            $('#delModal').modal('show');
        },
        updateCoupons(){
            const self = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/coupon`;
            let httpMethods = 'post';
            //在將資料傳送到後端之前先將裡面的日期資料轉成 UNIX 格式
            let timestamp = Math.floor(new Date(self.tempCoupon.due_date) / 1000);
            self.tempCoupon.due_date = timestamp;
            self.isLoading = true;
            if(!self.isNew){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/coupon/${self.tempCoupon.id}`;
                httpMethods = 'put';
            };
            this.$http[httpMethods](api , {data : self.tempCoupon}).then((res) => {
                if(res.data.success){
                    $('#couponModal').modal('hide');
                    self.isLoading = false;
                    self.getCoupons();
                }else{
                    $('#couponModal').modal('hide');
                    self.isLoading = false;
                    alert('優惠券建立失敗');
                }
            })
        },
        delCoupon(coupon){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/coupon/${coupon.id}`;
            this.$http.delete(api).then((res) => {
                if(res.data.success){
                    $('#delModal').modal('hide');
                    self.getCoupons();
                }else{
                    alert(res.data.message);
                    $('#delModal').modal('hide');
                }
            })
        }
    },
    created(){
        this.getCoupons();
    }
}
</script>