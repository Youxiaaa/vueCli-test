<template>
    <div>
        <!-- 初始Loading特效 -->
        <loading :active.sync="isLoading"></loading>
        
        <!-- 新增商品按鈕 -->
        <div class="text-right mt-3">
            <button class="btn btn-primary" @click="openProductModal('新增商品')">建立新的產品</button>
        </div>
        
        <!-- 主要內容 -->
        <table class="table table-hover mt-3">
            <thead>
                <tr>
                    <th class="text-center">分類</th>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th class="text-center">是否啟用</th>
                    <th class="text-center">編輯</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item) in products" :key="item.id">
                    <td width="120" class="text-center">
                        {{ item.category }}
                    </td>
                    <td>
                        {{ item.title }}
                    </td>
                    <td class="text-right" width="120">
                        {{ item.origin_price | dollarSign }}
                    </td>
                    <td class="text-right text-success font-weight-bold" width="120">
                        {{ item.price | dollarSign }}
                    </td>
                    <td width="120" class="text-center">
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else class="text-danger">未啟用</span>
                    </td>
                    <td width="125" class="text-center">
                        <button class="btn btn-sm btn-outline-primary" @click="openProductModal('編輯商品' , item)">編輯</button>
                        <button class="btn btn-sm btn-danger" @click="openDelModal(item)">刪除</button>
                    </td>
                </tr>
            </tbody>

        </table>

        <!-- 分頁按鈕 -->
        <div class="d-flex justify-content-center">
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class="{'disabled' : !pagination.has_pre}">
                <a class="page-link" href="#" aria-label="Previous" @click.prevent="updateList(pagination.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                <li class="page-item" v-for="(page , key) in pagination.total_pages" :key="key" :class="{'active' : pagination.current_page == page}"><a class="page-link" href="#" @click.prevent="updateList(page)">{{ page }}</a></li>
                <li class="page-item" :class="{'disabled' : !pagination.has_next}">
                <a class="page-link" href="#" aria-label="Next" @click.prevent="updateList(pagination.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
        </nav>
        </div>
        
        <!-- 新增and編輯modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>新增產品</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                    <div class="col-sm-4">
                        <div class="form-group">
                        <label for="image">輸入圖片網址</label>
                        <input type="text" class="form-control" id="image"
                            placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
                        </div>
                        <div class="form-group">
                        <label for="">或 上傳圖片
                            <i class="fas fa-spinner fa-pulse" v-if="fileUploadedStatus"></i>
                            <span v-if="errorMessageStatus" class="text-danger"> {{ errorMessage }} </span>
                        </label>
                        <input type="file" id="" class="form-control"
                            ref="files" @change="uploadFile">
                        <!-- <div class="alert alert-danger mt-3" role="alert" v-if="errorMessageStatus">
                            {{ errorMessage }}
                        </div> -->
                        </div>
                        <img :src="tempProduct.imageUrl"
                        class="img-fluid" alt="">
                    </div>
                    <div class="col-sm-8">
                        <div class="form-group">
                        <label for="title">標題</label>
                        <input type="text" class="form-control" id="title"
                            placeholder="請輸入標題" v-model="tempProduct.title">
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="category">分類</label>
                            <input type="text" class="form-control" id="category"
                            placeholder="請輸入分類" v-model="tempProduct.category">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">單位</label>
                            <input type="unit" class="form-control" id="unit"
                            placeholder="請輸入單位" v-model="tempProduct.unit">
                        </div>
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                        <label for="origin_price">原價</label>
                            <input type="number" class="form-control" id="origin_price"
                            placeholder="請輸入原價" v-model="tempProduct.origin_price">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">售價</label>
                            <input type="number" class="form-control" id="price"
                            placeholder="請輸入售價" v-model="tempProduct.price">
                        </div>
                        </div>
                        <hr>

                        <div class="form-group">
                        <label for="description">產品描述</label>
                        <textarea type="text" class="form-control" id="description"
                            placeholder="請輸入產品描述" v-model="tempProduct.description">
                        </textarea>
                        </div>
                        <div class="form-group">
                        <label for="content">說明內容</label>
                        <textarea type="text" class="form-control" id="content"
                            placeholder="請輸入產品說明內容" v-model="tempProduct.content">
                        </textarea>
                        </div>
                        <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox"
                            id="is_enabled" v-model="tempProduct.is_enabled" :true-value="1" :flase-value="0">
                            <label class="form-check-label" for="is_enabled">
                            是否啟用
                            </label>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click.prevent="updateProduct">確認</button>
                </div>
                </div>
            </div>
        </div>

        <!-- 刪除商品modal -->
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
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
                是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="delProduct(item)"> <i class="fas fa-spinner fa-pulse" v-if="isDeleted"></i> 確認刪除</button>
            </div>
            </div>
        </div>
        </div>

    </div>
</template>
<script>
import $ from 'jquery';
export default {
    data (){
        return{
            products : [],
            tempProduct : {},
            addORedit : '',
            fileUploadedStatus : false,
            isLoading : false,
            errorMessage : '',
            errorMessageStatus : false,
            pagination : {},
            isDeleted : false
        }
    },
    created(){
        this.updateList();
    },
    methods : {
        openProductModal(addORedit , item){
            const self = this;
            if(addORedit == '新增商品'){
                self.tempProduct = {};
                self.addORedit = '新增商品';
            }else{
                self.tempProduct = Object.assign({} , item) ;
                self.addORedit = '編輯商品';
            }
            $('#productModal').modal('show');
        },
        openDelModal(item){
            const self = this;
            self.tempProduct = item;
            $('#delProductModal').modal('show');
        },
        updateList(page = 1){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/products?page=${page}`;
            const self = this;
            self.isLoading = true;
            this.$http.get(api).then((res) => {
              self.products = res.data.products;
              self.pagination = res.data.pagination;
              self.isLoading = false;
        });
        },
        updateProduct(){
            const self = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/product`;
            let postORput = 'post';
            if(self.addORedit == '編輯商品'){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/product/${self.tempProduct.id}`;
                postORput = 'put';
            };
            this.$http[postORput](api , { data : self.tempProduct}).then((res) => {
                if(res.data.success == true){
                    self.updateList();
                    $('#productModal').modal('hide');
                }else{
                    self.updateList();
                    alert('商品更新失敗');
                    $('#productModal').modal('hide');
                }
            });
        },
        delProduct(){
            const self = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/product/${self.tempProduct.id}`;
            self.isDeleted = true
            this.$http.delete(api).then((res) => {
                if(res.data.success){
                    $('#delProductModal').modal('hide');
                    self.isDeleted = false;
                    self.updateList();
                }else{
                    alert(res.data.message);
                    $('#delProductModal').modal('hide');
                    self.isDeleted = false;
                    self.updateList();
                }
            })
        },
        uploadFile(){
            const self = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMERPATH}/admin/upload`;
            const uploadedFile = this.$refs.files.files[0];
            const formData = new FormData();
            self.errorMessageStatus = false;
            self.errorMessage = '';
            self.fileUploadedStatus = true;
            self.tempProduct.imageUrl = '';
            formData.append('file-to-upload' , uploadedFile);
            this.$http.post(api , formData , {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                }
            }).then((res) => {
                if(res.data.success){
                self.$set(self.tempProduct , 'imageUrl' , res.data.imageUrl);
                self.fileUploadedStatus = false;
                
                }else{
                    self.fileUploadedStatus = false;
                    self.errorMessage = res.data.message;
                    self.errorMessageStatus = true;
                    self.tempProduct.imageUrl = '別亂傳哦北七';
                    // setTimeout(() => {
                    //     self.errorMessageStatus = false
                    // } ,6000);
                    // console.log(res.data);
                }
            })
        }
    }
}
</script>