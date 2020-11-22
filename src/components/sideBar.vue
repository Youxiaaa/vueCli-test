<template>
    <div>
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="sidebar-sticky pt-3">
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>管理員功能</span>
          <a class="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link to="./products" class="nav-link">商品列表</router-link>
          </li>
          <li class="nav-item">
            <router-link to="./order" class="nav-link">訂單列表</router-link>
          </li>
          <li class="nav-item">
            <router-link to="./coupons" class="nav-link">管理折價券</router-link>
          </li>
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>模擬功能</span>
          <a class="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link to="/customerOrder" class="nav-link text-primary font-weight-bold">模擬訂單</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/customerOrder2" class="nav-link text-primary font-weight-bold">模擬訂單2</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/cart" class="nav-link text-primary font-weight-bold">模擬購物車</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/checkOut" class="nav-link text-primary font-weight-bold">模擬結帳</router-link>
          </li>

        </ul>
      </div>
    </nav>
    </div>
</template>