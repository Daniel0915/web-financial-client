<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import { ChannelTypeEnum } from "@/data/enum/ChannelTypeEnum";


// TODO : index db
if (!window.indexedDB) {
    window.alert("121");
}

const customerData = [
    { ssn: "444-44-4444", name: "Bill",     age: 35,    email: "bill@company.com" },
    { ssn: "555-55-5555", name: "Donna",    age: 32,    email: "donna@home.org" }
];


const dbName = "the_name";
const version = 5;
const objectStoreNm = "customers";

// 1. indexedDB 연결 요청
var request = indexedDB.open(dbName, version);


// 2. 오료 처리
request.onerror = function (event) {
    // Handle errors.
};


// 3-1. 데이터베이스 초기화
// 3-2. 호출 시기 : version 이 생성되거나 버전이 올라갈 때 호출 됨.
// 3-3. 객체 저장소와 인덱스를 생성
request.onupgradeneeded = function (event) {
    var db = event.target.result;

    // 4-1. 객체 저장소 생성
    // 4-2. 키 생성기(autoIncrement)
    var objectStore = db.createObjectStore(objectStoreNm, { keyPath : "ssn", autoIncrement : true });


    // 5. 인덱스 생성, 중복 허용 O
    objectStore.createIndex("name", "name", { unique: false });

    // 5. 인덱스 생성, 중복 허용 X
    objectStore.createIndex("email", "email", { unique: true });

    // 6. 데이터 추가
    objectStore.transaction.oncomplete = function (event) {
        // 객체 저장소 => customers
        var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");

        customerData.forEach(function (customer) {
            customerObjectStore.add(customer);
        });
    };
};

// 7. 데이터 읽기
request.onsuccess = function (event) {
    var db = event.target.result;

    // ################### 데이터 읽기 [start] ###################

    // 8-1. 트랜잭션 생성 (readonly)
    // 8-2. 첫번째 인자는 트랜잭션이 확장될 객체 저장소의 목록
    // 8-3. 빈 배열이면, 모든 객체 저장소에 대핸 트랜잭션 확장
    // 8-4. 두번째 인자 값이 없으면 읽기 전용(readonly)
    // var transaction = db.transaction(["customers"], "readonly");
    // var objectStore = transaction.objectStore("customers");
    //
    // // 9. 모든 데이터 읽기
    // var getAllRequest = objectStore.getAll();
    //
    // getAllRequest.onsuccess = function (event) {
    //     console.log("All Customers : ", event.target.result);
    // };
    //
    // getAllRequest.onerror = function (event) {
    //     console.erro("Error fetching data : ", event.target.error);
    // }

    // ################### 데이터 읽기 [start] ###################


    // ################### 데이터 추가 [start] ###################

    // // 10. 데이터 추가(트랜잭션 read write)
    // var transaction = db.transaction(["customers"], "readwrite");
    //
    // // 11. 트랜잭션은 이벤트 루프(Event loop) 와 매우 밀접하게 연관되어 있습니다.
    // // 12. 트랜잭션을 만들어 놓고 사용하지 않은 채 이벤트 루프로 돌아가게 된다면 트랜잭션은 비활성화 상태가 됩니다
    // // 13. 트랜잭션을 활성화 상태로 유지하는 유일한 방법은 트랜잭션에 그것을 요청
    // // 14. TRANSACTION_INACTIVE_ERR 라는 에러 코드가 나타나기 시작한다면, 뭔가 잘못되기 시작한 것입니다
    //
    // const newCustomerData = [
    //     { ssn: "777-11-1111", name: "Peter", age: 1,    email: "ufo9363@company.com" },
    // ];
    //
    //
    // transaction.oncomplete = function (event) {
    // };
    //
    // transaction.onerror = function (event) {
    //     console.error(event);
    //     // 에러 처리
    // };
    //
    // var objectStore = transaction.objectStore("customers");
    //
    // for (var i in newCustomerData) {
    //     // add() 주의점 : 같은 키를 가진 데이터가 데이터베이스 안에 존재하지 않아야 한다는 점 주의
    //     // 대안으로 데이터를 수정하고 싶거나, 혹은 이미 데이터가 있건 말건 상관 없다면 put() 사용
    //     var request = objectStore.add(newCustomerData[i]);
    //     request.onsuccess = function (event) {
    //     }
    // }
    // // ################### 데이터 추가 [end] ###################
    //
    // // ################### 데이터 삭제 [start] ###################
    // var requestDelete = objectStore.delete("444-44-4444");
    // requestDelete.onsuccess = function (event) {
    //     console.log(event.target.result);
    // }


    // ################### 데이터 삭제 [start] ###################
    // var request = db
    //     .transaction(["customers"], "readwrite")
    //     .objectStore("customers")
    //     .delete("444-44-4444");
    // request.onsuccess = function (event) {
    //     // It's gone!
    // };
    // ################### 데이터 삭제 [end] ###################

    // ################### 데이터 조회 [start] ###################
    // var transaction = db.transaction(["customers"]);
    // var objectStore = transaction.objectStore("customers");
    // var request = objectStore.get("555-55-5555");
    //
    // request.onerror = function (event) {
    //     console.error(event);
    // }
    //
    // request.onsuccess = function (event) {
    //     console.log(event.target.result === request.result);
    // }

    // 데이터 조회 단순화, transaction 특정 모드 없이(default 는 readonly)
    // db.transaction("customers").objectStore("customers").get("555-55-5555").onsuccess = function (event) {
    //     console.log(event.target.result.name);
    // }
    // ################### 데이터 조회 [end] ###################


    // ################### 데이터 업데이트 [start] ###################
    var objectStore = db
        .transaction(["customers"], "readwrite")
        .objectStore("customers");
    var request = objectStore.get("777-11-1111");

    request.onerror = function (event) {

        // Handle errors!
    };
    request.onsuccess = function (event) {
        var data = event.target.result;
        // // 업데이트 X
        data.age = 14;

        // 업데이트 O
        var requestUpdate = objectStore.put(data);
        requestUpdate.onerror = function (event) {
            console.log("error");
            // error handle
        };

        requestUpdate.onsuccess = function (event) {
            // success update
            console.log("update");

        };
    };

    // ################### 데이터 업데이트 [end] ###################
}

// ################### 데이터 추가 [start] ###################

request.onsuccess = function (event) {
    var db = event.target.result;
    var transaction = db.transaction(["customers"], "readwrite");

    const newCustomerData = [
        { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
        { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
    ];

    transaction.oncomplete = function (event) {
    };

    transaction.onerror = function (event) {
    };

    var objectStore = transaction.objectStore("customers");

    for (var i in newCustomerData) {
        var request = objectStore.add(newCustomerData[i]);
        request.onsuccess = function (event) {
        }
    }
};

// ################### 데이터 추가 [end] ###################



// ################### 커서 사용하기 [start] ###################
/*request.onsuccess = function (event) {
    var db = event.target.result;
    var objectStore = db.transaction("customers").objectStore("customers");

    // get() 과 다르게 cursor 는 모든 값을 탐색할 수 있음.
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            alert(`Name for SSN ${cursor.key} is ${cursor.value.name}`);
            cursor.continue();
        } else {
            alert("No more entries!");
        }
    }

    // 커서를 사용하는 일반적인 패턴 중 하나
    // 객체 저장소의 모든 객체를 검색하여 array 에 추가
    var customers = [];

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            customers.push(cursor.value);
            cursor.continue();
        } else {
            alert(`Got all customers ${customers}`);
            console.log(customers);
        }
    };

    /!*
     * getAllyKeys() 동일한 기능이지만, IndexedDB 표준이 아니기 때문에 추후 삭제될 예정
     * 그리고 getAll 과 openCursor 동일하지만 성능상 비용이 getAll 이 더 비용이 발생합니다.
     * 에를 들어 getAll() 을 사용할 때, Gecko 는 모든 객체를 한 번에 생성합니다.
     * 만약 키 각각을 보는 것에만 관심이 있다면, openCursor 사용하는 것이 getAll() 을 사용하는 것보다
     * 훨씬 효율적입니다. 반면에 객체 저장소의 모든 객체 배열을 가져오려는 경우에는 getAll() 사용하세요.
     *!/
    objectStore.getAll().onsuccess = function (event) {
        alert(`Got all customers : ${event.target.result}`);
    };
};*/
// ################### 커서 사용하기 [end] ###################

// ################### index 사용하기 [start] ###################

// 먼저, request.onupgradeneeeded로 index를 생성해주세요:
// objectStore.createIndex("name", "name");
// 그렇지 않을 경우 DOMException이 발생합니다.

request.onsuccess = function (event) {
    var db = event.target.result;
    var objectStore = db.transaction("customers").objectStore("customers");
    var index = objectStore.index("name");


    /*
     * name 고유하지 않기 때문에 name 값이 "Donna" 로 설정된 항목이 하나 이상 있을 수 있습니다.
     * 이 경우 항상 가장 낮은 키 값인 결과 하나만 얻게 됨.
     */
    // index.get("donna@home.org").onsuccess = function (event) {
    //     alert(`Donna's SSN is ${event.target.result.ssn}`);
    // };

    /*
     * 특정 "name" index 로 모든항목에 액세스해야 하는 경우
     * 인덱스들 마다 2 가지 다른 종류의 cursor 열수 있음
     * 1. 일반적인 커서는 인덱스 속성을 객체 저장소의 객체에 매핑합니다.
     * 2. 그리고 키 ㅓ서는 객체를 객체 저장소에 저장하기 위해 사용된 키에 인덱스를 매핑합니다.
     */

    // 일반적인 커서를 사용해서 고객 레코드 전체를 가져오기
    /*index.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            // cursor.key 는 "Bill"과 같은 이름이며,
            // cursor.value 는 객체 전체를 의미합니다.
            alert(`Name: ${cursor.key}, SSN: ${cursor.value.ssn}, email: ${cursor.value.email}`)
            cursor.continue();
        }
    };*/

    // 키 커서를 사용해서 고객 레코드 객체 키를 가져오기
    // index.openKeyCursor().onsuccess = function (event) {
    //     var cursor = event.target.result;
    //     if (cursor) {
    //         // cursor.key는 "Bill"과 같은 이름이며, cursor.value는 사회보장번호(SSN)입니다.
    //         // 저장된 객체의 나머지 부분을 직접적으로 가져올 방법은 없습니다.
    //         alert("Name: " + cursor.key + ", SSN: " + cursor.primaryKey);
    //         cursor.continue();
    //     }
    // };
};

// ################### index 사용하기 [end] ###################

// ################### 커서들의 범위와 방향을 특정하기 [start] ###################
request.onsuccess = function (event) {
    var db = event.target.result;
    var objectStore = db.transaction("customers").objectStore("customers");
    var index = objectStore.index("name");

    /*
     * openCursor() 또는 openKeyCursor()의 첫 번째 인자로 사용할 수 있는 키 범위 객체(key range object)를
     * 사용하여 커서에서 볼 값의 범위를 제한할 수 있습니다.
     * 단일 키만 허용하도록 하는 key range 를 만들거나 하한 또는 상한값이 있는 key range 를 만들 수 있습니다.
     * 또는 하한 및 상한 값이 모두있는 key range 를 만들 수 있습니다.
     * 범위는 "closed"(즉, key range 가 주어진 값까지 포함)거나 "open"(즉, key range 가 주어진 값은 포함하지 않음)일 수 있습니다.
     * 다음은 key range 가 작동하는 방식입니다:
     */

    // "Donna"만을 조회
    var singleKeyRange = IDBKeyRange.only("Donna");

    // "Bill"을 포함한, "Bill" 이후 모든 값을 조회
    var lowerBoundKeyRange = IDBKeyRange.lowerBound("Bill");

    // "Bill"을 제외한, "Bill" 다음 모든 값을 조회
    var lowerBoundOpenKeyRange = IDBKeyRange.lowerBound("Bill", true);

    // "Donna"를 제외한, 이전 모든 값을 조회
    var upperBoundOpenKeyRange = IDBKeyRange.upperBound("Donna", true);

    // "Donna"를 제외한, 를 제외한, "Bill"과 "Donna" 사이 모든 값을 조회
    var boundKeyRange = IDBKeyRange.bound("Bill", "Donna", false, true);

    // 위 키 범위 중 하나를 사용하려면, openCursor()/openKeyCursor()에 첫 번째 인자로 넘겨주세요.
    index.openCursor(singleKeyRange).onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            // console.log(cursor.value);
            cursor.continue();
        }
    };

    // IndexedDB 에서 Cursor 를 사용하여 내림차순으로 반복하기
    index.openCursor(lowerBoundKeyRange, 'prev').onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            // console.log(cursor.value);
            cursor.continue();
        }
    };

    // 범위를 제한하지 않고 단순히 방향만 변경하는 경우
    // 만약 결과를 제한하지 않고 단순히 커서 방향만 변경하고 싶다면, 첫 번째 인자로 null 을 전달하면 됩니다.
    index.openCursor(null, "prev").onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            // Do something with the entries.
            // console.log(cursor.value);
            cursor.continue();
        }
    };

    // 중복 제거하면서 반복하기
    /*
     * "name"과 같은 인덱스가 고유하지 않은 경우, 동일한 값이 여러 엔트리에 존재할 수 있습니다.
     * 그러나 오브젝트 스토어에서는 키가 항상 고유해야 하므로 이런 상황은 발생하지 않습니다.
     * 만약 중복된 값을 필터링하면서 커서를 반복하고 싶다면, direction 파라미터로 "nextunique"(오름차순) 또는 "prevunique"(내림차순)을 전달하면 됩니다.
     * nextunique 또는 prevunique 를 사용할 경우, 동일한 키 값 중 가장 낮은 키의 항목만 반환됩니다.
     */

    index.openKeyCursor(null, "nextunique").onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log(cursor.value);
            // 항목에 대해 작업을 수행합니다.
            cursor.continue();
        }
    };
};
// ################### 커서들의 범위와 방향을 특정하기 [end] ###################





// EventSource 에서 받은 메시지를 저장할 상태
// const messages = ref([]); // 실시간 메시지를 담는 배열
//
// const userId = 1;
// const url = `/api/redis/pub-sub/get-flux-message?userId=${userId}`;
// let eventSource = new EventSource(url); // EventSource 인스턴스
//
//
// // EventSource 를 초기화하는 함수
// function initEventSource() {
//     // 메시지가 수신되었을 때
//     eventSource.onmessage = (event) => {
//         // const message = JSON.parse(event.data);
//         const message = JSON.parse(event.data);
//         callPush(message);
//     }
// }
//
// // 컴포넌트가 마운트되었을 때, EventSource 를 초기화
// onMounted(() => {
//     initEventSource();
// });
//
// // 컴포넌트가 언마운트될 때 EventSource 닫기
// onUnmounted(() => {
//     if (eventSource) {
//         eventSource.close();
//     }
// });
//
// function callPush(message) {
//     Notification.requestPermission().then(perm => {
//         if (perm === "granted") {
//             const notification = new Notification("[알림 Push]", {
//                 body: `${ChannelTypeEnum[message.channelType]}`,
//                 icon: "favicon.ico",
//             });
//
//             notification.addEventListener("click", e => {
//                 // TODO : 클릭 시, 지분 공시 페이지로 이동
//                 const url = "https://velog.io/@dev-redo/%ED%81%B4%EB%A6%B0%EC%BD%94%EB%93%9C-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-7%EC%9E%A5-%EA%B0%9D%EC%B2%B4-%EB%8B%A4%EB%A3%A8%EA%B8%B0";
//
//                 // 알림 창을 닫기
//                 notification.close();
//                 window.open(url, "_blank");  // 새 탭으로 URL 열기
//             })
//         }
//     })
// }

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
