<script setup>
import { LargeHoldingsDetailsService } from "@/service/LargeHoldingsDetailsService";
import { onBeforeMount, ref, computed } from "vue";


const loading1 = ref(false);
const largeHoldingsDetailList = ref([]);
const page = ref(0);
const totalRecords = ref(0);
const rows = ref(10);

const selected = ref(null);
const selectList = ref([
    { name: "내부자 이름", code: "largeHoldingsName" },
    { name: "매매 사유", code: "tradeReason" },
    { name: "주식 종류", code: "stockType" },
]);
const inputText = ref(null);

const isButtonDisabled = computed(() => selected.value == null || inputText.value == null  || !selected.value || !inputText.value.trim());

onBeforeMount(() => {
    let params = {
        orderColumn : "tradeDt",
        isDescending: true,
        page : page.value,
        size : rows.value,
    };

    searchData(params);
});

function searchBtn(selected, inputText) {
    page.value = 0; // page init 초기화
    const key = selected.code;
    let params = {
        orderColumn: "tradeDt",
        isDescending: true,
        [key]: inputText,
        page: page.value,
        size: rows.value
    };
    this.searchData(params);
}


function searchData(params) {
    LargeHoldingsDetailsService.getSearchData(params).then((response) => {
        largeHoldingsDetailList.value = response.data.content;
        totalRecords.value = response.data.totalElements;
        loading1.value = false;
        largeHoldingsDetailList.value.forEach((largeHoldingsDetail) => {
            largeHoldingsDetail.tradeDt = largeHoldingsDetail.tradeDt.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
            largeHoldingsDetail.url = `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${largeHoldingsDetail.rceptNo}`;
        });
    });

}


function onPageChange(event) {
    page.value = event.page;

    let params = {
        orderColumn : "tradeDt",
        isDescending: true,
        page : page.value,
        size : rows.value,
    };
    searchData(params);
}


</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">대주주 매매 상세</div>
        <DataTable
            :value="largeHoldingsDetailList"
            :rows="rows"
            dataKey="seq"
            :rowHover="true"
            :loading="loading1"
            showGridlines
        >
            <template #header>
                <div class="flex justify-between">
                    <InputGroup>
                        <Select v-model="selected" :options="selectList" optionLabel="name" placeholder="검색어 선택" />
                        <InputText :placeholder="!selected ? '검색어 선택해주세요.' : '검색어 입력해주세요.'" v-model="inputText" :disabled="!selected"/>
                        <Button label="검색" @click="searchBtn(selected, inputText)" :disabled="isButtonDisabled" />
                    </InputGroup>
                </div>
            </template>

            <template #empty> 데이터가 없습니다. </template>
            <template #loading> Loading data. Please wait. </template>
            <Column field="largeHoldingsName" header="내부자 이름" style="min-width: 12rem"></Column>
            <Column field="tradeReason" header="매매 이유" style="min-width: 12rem"></Column>
            <Column field="stockType" header="증권 종류" style="min-width: 12rem"></Column>
            <Column field="tradeDt" header="거래 날짜" style="min-width: 12rem"></Column>
            <Column field="changeStockAmount" header="거래량" style="min-width: 12rem"></Column>
            <Column field="unitStockPrice" header="평단가" style="min-width: 12rem"></Column>
            <Column field="afterStockAmount" header="보유주식" style="min-width: 12rem"></Column>
            <Column field="url" header="URL" style="min-width: 12rem"></Column>
        </DataTable>
        <Paginator
            :rows="rows"
            :totalRecords="totalRecords"
            :first="page * rows"
            @page="onPageChange"
        />
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
