<template>
  <view class="container" style="padding: 20rpx">
    <view style="padding-bottom: 100rpx">
      <view class="bg-white">
        <view class="section">
          <list-cell :hover="false">
            <view class="w-100 d-flex align-items-center">
              <view class="d-flex flex-column w-60">
                <view
                  class="w-100 font-size-lg text-color-base text-truncate mb-10"
                >
                  {{ order?.store?.name }}
                </view>
                <view class="w-100 d-flex align-items-center overflow-hidden">
                  <image
                    class="flex-shrink-0"
                    src="/static/images/order/location.png"
                    style="width: 30rpx; height: 30rpx"
                  ></image>
                  <view class="text-truncate font-size-sm text-color-assist">
                    {{ order?.store?.address }}
                  </view>
                </view>
              </view>
              <view class="d-flex justify-content-end align-items-center w-40">
                <image
                  src="/static/images/order/mobile.png"
                  style="width: 60rpx; height: 60rpx; margin-right: 30rpx"
                ></image>
                <image
                  src="/static/images/order/navigation.png"
                  style="width: 60rpx; height: 60rpx"
                ></image>
              </view>
            </view>
          </list-cell>
          <list-cell :hover="false" padding="50rpx 30rpx">
            <view
              class="w-100 d-flex flex-column position-relative"
              style="margin-bottom: -40rpx"
            >
              <view
                class="w-100 d-flex align-items-center mb-40"
                v-for="(good, index) in order?.goods"
                :key="index"
              >
                <view class="d-flex flex-column w-60 overflow-hidden">
                  <view
                    class="font-size-lg text-color-base mb-10 text-truncate"
                  >
                    {{ good?.name }}
                  </view>
                  <view class="font-size-sm text-color-assist text-truncate">
                    {{ good?.property }}
                  </view>
                </view>
                <view
                  class="d-flex w-40 align-items-center justify-content-between pl-30"
                >
                  <view class="font-size-base text-color-base">
                    x{{ good?.number }}
                  </view>
                  <view class="font-size-base text-color-base font-weight-bold">
                    ???{{ good?.price }}
                  </view>
                </view>
              </view>
            </view>
          </list-cell>
        </view>
        <view class="section">
          <list-cell :hover="false" padding="50rpx 30rpx">
            <view class="w-100 d-flex flex-column">
              <view class="pay-cell">
                <view>????????????</view>
                <view class="font-weight-bold">{{ order?.pay_mode }}</view>
              </view>
              <view class="pay-cell">
                <view>????????????</view>
                <view class="font-weight-bold">???{{ order?.amount }}</view>
              </view>
            </view>
          </list-cell>
        </view>
        <view class="section">
          <list-cell :hover="false" padding="50rpx 30rpx">
            <view class="w-100 d-flex flex-column">
              <view class="pay-cell">
                <view>????????????</view>
                <view class="font-weight-bold">
                  {{ formatDateTime(order?.created_at) }}
                </view>
              </view>
              <view class="pay-cell">
                <view>????????????</view>
                <view class="font-weight-bold">{{ order?.store?.name }}</view>
              </view>
              <view class="pay-cell">
                <view>????????????</view>
                <view class="font-weight-bold">{{ order?.pay_mode }}</view>
              </view>
              <view class="pay-cell">
                <view>?????????</view>
                <view class="font-weight-bold">{{ order?.order_no }}</view>
              </view>
            </view>
          </list-cell>
        </view>
        <list-cell :hover="false" padding="50rpx 30rpx 20rpx" last>
          <view class="w-100 d-flex flex-column">
            <view class="pay-cell">
              <view>?????????</view>
              <view class="font-weight-bold">{{ order?.sort_num }}</view>
            </view>
            <view class="pay-cell">
              <view>????????????</view>
              <view class="font-weight-bold">??????</view>
            </view>
            <view class="pay-cell">
              <view>????????????</view>
              <view class="font-weight-bold">????????????</view>
            </view>
            <view class="pay-cell">
              <view>??????????????????</view>
              <view class="font-weight-bold">
                {{ order?.productioned_time }}
              </view>
            </view>
            <view class="pay-cell">
              <view>??????</view>
              <view class="font-weight-bold">{{ order?.postscript }}</view>
            </view>
          </view>
        </list-cell>
      </view>
      <view class="position-relative w-100">
        <image
          src="/static/images/order/bottom.png"
          mode="widthFix"
          class="w-100"
        ></image>
        <view class="invote-box" v-if="!order?.invoice_status">
          <view class="font-size-base text-color-primary">????????????</view>
          <image src="/static/images/order/right.png"></image>
        </view>
      </view>
    </view>
    <view class="btn-box">
      <view class="item" v-if="order?.invoice_status > 0">
        <button type="primary">????????????</button>
      </view>
      <view class="item" @tap="jumpReview(order)">
        <button type="primary" plain>?????????</button>
      </view>
      <view class="item">
        <button type="primary" @tap="jumpDrink">????????????</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
/* global uni */
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { onLoad } from '@dcloudio/uni-app';
import { formatDateTime } from '@/utils/utils';
import ListCell from '@/components/list-cell/ListCell.vue';

export default defineComponent({
  name: 'OrderDetail',
  components: {
    ListCell
  },
  setup() {
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const historyOrder = computed(() => $store.getters.historyOrder);

    // ??????????????????
    const order = ref({});

    onLoad(({ id }) => {
      order.value = historyOrder.value.find(
        (item: { id: number }) => item.id === Number(id)
      );
    });

    // ????????????
    function jumpDrink(): void {
      uni.switchTab({
        url: '/pages/drink/drink'
      });
    }

    // ????????????
    function jumpReview(item: {
      store: { name: string };
      completed_time: string;
      typeCate: string;
    }): void {
      const storename = item?.store?.name || '';
      const date = item?.completed_time?.split(' ')[0] || '';
      const typeCate = item?.typeCate || '';

      uni.navigateTo({
        url: `/pages/history-order/review/Review?storename=${storename}&typeCate=${typeCate}&date=${date}`
      });
    }

    return {
      formatDateTime,
      isLogin,
      order,
      jumpDrink,
      jumpReview
    };
  }
});
</script>

<style lang="scss" scoped>
@import './order-detail.scss';
</style>
