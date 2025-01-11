<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import { ChannelTypeEnum } from "@/data/enum/ChannelTypeEnum";


// EventSource 에서 받은 메시지를 저장할 상태
const messages = ref([]); // 실시간 메시지를 담는 배열

const userId = 1;
const url = `/api/redis/pub-sub/get-flux-message?userId=${userId}`;
let eventSource = new EventSource(url); // EventSource 인스턴스


// EventSource 를 초기화하는 함수
function initEventSource() {
    // 메시지가 수신되었을 때
    eventSource.onmessage = (event) => {
        // const message = JSON.parse(event.data);
        const message = JSON.parse(event.data);
        callPush(message);
    }
}

// 컴포넌트가 마운트되었을 때, EventSource 를 초기화
onMounted(() => {
    initEventSource();
});

// 컴포넌트가 언마운트될 때 EventSource 닫기
onUnmounted(() => {
    if (eventSource) {
        eventSource.close();
    }
});

function callPush(message) {
    Notification.requestPermission().then(perm => {
        if (perm === "granted") {
            const notification = new Notification("[알림 Push]", {
                body: `${ChannelTypeEnum[message.channelType]}`,
                icon: "favicon.ico",
            });

            notification.addEventListener("click", e => {
                // TODO : 클릭 시, 지분 공시 페이지로 이동
                const url = "https://velog.io/@dev-redo/%ED%81%B4%EB%A6%B0%EC%BD%94%EB%93%9C-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-7%EC%9E%A5-%EA%B0%9D%EC%B2%B4-%EB%8B%A4%EB%A3%A8%EA%B8%B0";

                // 알림 창을 닫기
                notification.close();
                window.open(url, "_blank");  // 새 탭으로 URL 열기
            })
        }
    })
}

</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <StatsWidget />

        <div class="col-span-12 xl:col-span-6">
            <RecentSalesWidget />
            <BestSellingWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <RevenueStreamWidget />
            <NotificationsWidget />
        </div>
    </div>
</template>
