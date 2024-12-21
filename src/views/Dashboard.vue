<script setup>
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';


function callPush() {
    Notification.requestPermission().then(perm => {
        if (perm === "granted") {
            const notification = new Notification("Example notification", {
                body: "엘리쿤!",
                data: { hello: "world" },
                icon: "favicon.ico",
                // tag: "A"
            });

            notification.addEventListener("click", e => {
                // 새로운 창 열리면서,
            })
        }
    })
}


function notifyMe() {
    console.log(Notification.permission)
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification("Hi there!");
        // …
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                const notification = new Notification("Hi there!");
                // …
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
}
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <button @click="callPush">click</button>

        <button @click="notifyMe">notifyMe</button>



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
