<script setup>
import { LargeHoldingsDetailsService } from "@/service/LargeHoldingsDetailsService";
import { computed, onBeforeMount, ref } from "vue";


const loading1 = ref(false);
const largeHoldingsDetailList = ref([]);
const page = ref(0);
const totalRecords = ref(0);
const rows = ref(10);
const tradeDateRange = ref(null);

const selectList = ref([
    { name: "검색어 선택", code: "" },
    { name: "내부자 이름", code: "largeHoldingsNameContains" },
    { name: "매매 사유", code: "tradeReasonContains" },
    { name: "증권 종류", code: "stockTypeContains" },
]);
const selected = ref(selectList.value[0]);
const inputText = ref(null);

const isButtonEnabled = computed(() => {
    // init selected value case
    if (selected.value.code === '') {
        return true;
    }

    // another selected value case
    if (selected.value.code !== '' && inputText.value) {
        return true;
    }

    return false;
});

onBeforeMount(() => {
    let params = {
        orderColumn : "tradeDt",
        isDescending: true,
        page : page.value,
        size : rows.value,
    };

    searchData(params);
});


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

function searchBtn(selected, inputText, tradeDateRange) {
    const param = getSearchParam(0, selected, inputText, tradeDateRange);
    this.searchData(param);
}

function onPageChange(event, selected, inputText, tradeDateRange) {
    const param = getSearchParam(event.page, selected, inputText, tradeDateRange);
    searchData(param);
}

function getSearchParam(inputPage, selected, inputText, tradeDateRange) {
    page.value = inputPage;
    const tradeDtGoe = !tradeDateRange ? null : formatDate(tradeDateRange[0]);
    const tradeDtLoe = !tradeDateRange ? null : formatDate(tradeDateRange[1]);
    const key = selected.code;

    return {
        orderColumn: "tradeDt",
        isDescending: true,
        page: page.value,
        size: rows.value,
        ...(key && { [key]: inputText }),
        ...(tradeDtGoe && { ['tradeDtGoe']: tradeDtGoe }),
        ...(tradeDtLoe && { ['tradeDtLoe']: tradeDtLoe }),
    };
}

function formatDate(date) {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};


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
                        <DatePicker v-model="tradeDateRange" selectionMode="range"
                                    :manualInput="false"
                                    placeholder="거래 날짜 선택">
                            <template #footer>
                                <div class="flex flex-wrap gap-2">
                                    <Button @click="tradeDateRange = null"  icon="pi pi-times" severity="danger" text raised rounded />
                                </div>
                            </template>
                        </DatePicker>

                        <Select v-model="selected" :options="selectList" optionLabel="name" placeholder="검색어 선택" />
                        <InputText :placeholder="selected.code === '' ? '검색어 선택해주세요.' : '검색어 입력해주세요.'" v-model="inputText" :disabled="selected.code === ''"/>
                        <Button label="검색" @click="searchBtn(selected, inputText, tradeDateRange)" :disabled="!isButtonEnabled" />
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
            @page="onPageChange($event, selected, inputText, tradeDateRange)"
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
