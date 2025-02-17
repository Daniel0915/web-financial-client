<script setup>
import { LargeHoldingsDetailsService } from "@/service/LargeHoldingsDetailsService";
import { computed, onBeforeMount, ref } from "vue";


const loading1 = ref(false);
const largeHoldingsDetailList = ref([]);
const page = ref(0);
const totalRecords = ref(0);
const rows = ref(10);
const tradeDateRange = ref(null);
const sortField = ref('tradeDt');
const sortOrder = ref(true); // 내림차순 default

const selectList = ref([
    { name: "검색어 선택", code: "" },
    { name: "내부자 이름", code: "largeHoldingsNameContains" },
    { name: "매매 사유", code: "tradeReasonContains" },
    { name: "증권 종류", code: "stockTypeContains" },
]);
const selected = ref(selectList.value[0]);
const inputText = ref(null);

const selectRangeList = ref([
    { name: "범위 선택(거래량, 평단가, 보유주식)", code: "" },
    { name: "거래량", code: "changeStockAmount" },
    { name: "평단가", code: "unitStockPrice" },
    { name: "보유주식", code: "afterStockAmount" },
]);

const selectedRange = ref(selectRangeList.value[0]);
const minAmount = ref(null);
const maxAmount = ref(null);

const onSort = (event) => {
    sortField.value = event.sortField;
    sortOrder.value = event.sortOrder;
    const param = getSearchParam(0, selected.value, inputText.value, tradeDateRange.value, sortField.value, sortOrder.value, selectedRange.value, minAmount.value, maxAmount.value);
    searchData(param);
};

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

function formatAccountingNumber(number) {
    const absNumber = Math.abs(number).toLocaleString('en-US'); // 천 단위 콤마 추가

    // 음수는 괄호로 표시, 양수는 그대로 표시
    return number < 0 ? `(${absNumber})` : absNumber;
}

function searchBtn(selected, inputText, tradeDateRange, sortField, sortOrder, selectedRange, minAmount, maxAmount) {
    const param = getSearchParam(0, selected, inputText, tradeDateRange, sortField, sortOrder, selectedRange, minAmount, maxAmount);
    searchData(param);
}

function onPageChange(event, selected, inputText, tradeDateRange, sortField, sortOrder, selectedRange, minAmount, maxAmount) {
    const param = getSearchParam(event.page, selected, inputText, tradeDateRange, sortField, sortOrder, selectedRange, minAmount, maxAmount);
    searchData(param);
}

function getSearchParam(inputPage, selected, inputText, tradeDateRange, orderColumn, sortOrder, selectedRange, minAmount, maxAmount) {
    page.value = inputPage;
    const tradeDtGoe = !tradeDateRange ? null : formatDate(tradeDateRange[0]);
    const tradeDtLoe = !tradeDateRange ? null : formatDate(tradeDateRange[1]);
    const key = selected.code;

    let param = {
        orderColumn: orderColumn ?? "tradeDt",
        isDescending: sortOrder === null || sortOrder === undefined || sortOrder === '' ? true : (sortOrder === -1),
        page: page.value,
        size: rows.value,
        ...(key && inputText && { [key]: inputText }),
        ...(tradeDtGoe && { ['tradeDtGoe']: tradeDtGoe }),
        ...(tradeDtLoe && { ['tradeDtLoe']: tradeDtLoe }),
    };

    if (selectedRange && selectedRange.code) {
        param[`${selectedRange.code}Goe`] = minAmount ?? '';
        param[`${selectedRange.code}Loe`] = maxAmount ?? '';
    }

    return param;
}

function formatDate(date) {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function windowOpen(url) {
    window.open(url, '_blank');
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
            removableSort
            @sort="onSort"
            showGridlines
        >
            <template #header>
                <div class="card flex flex-wrap gap-4">
                    <div class="flex-auto">
                        <InputGroup>
                            <DatePicker v-model="tradeDateRange" selectionMode="range"
                                        :manualInput="false"
                                        placeholder="거래 날짜 선택"
                                        showIcon fluid iconDisplay="input"
                                        inputId="tradeDateRange"
                            >
                                <template #footer>
                                    <div class="flex flex-wrap gap-2">
                                        <Button @click="tradeDateRange = null" icon="pi pi-times" severity="danger" text
                                                raised rounded />
                                    </div>
                                </template>
                            </DatePicker>
                        </InputGroup>
                    </div>

                    <div class="flex-auto">
                        <InputGroup>
                            <Select v-model="selectedRange" :options="selectRangeList" optionLabel="name"/>
                            <template v-if="selectedRange.name === '평단가'">
                                <InputNumber v-model="minAmount" placeholder="최소 금액" inputId="currency-kr" mode="currency" currency="KRW" locale="ko-KR" fluid :disabled="selectedRange.code === ''"/>
                                <InputGroupAddon>~</InputGroupAddon>
                                <InputNumber v-model="maxAmount" placeholder="최대 금액" inputId="currency-kr" mode="currency" currency="KRW" locale="ko-KR" fluid :disabled="selectedRange.code === ''"/>
                            </template>
                            <template v-else>
                                <InputNumber v-model="minAmount" placeholder="최소 주식" fluid :disabled="selectedRange.code === ''"/>
                                <InputGroupAddon>~</InputGroupAddon>
                                <InputNumber v-model="maxAmount" placeholder="최대 주식" fluid :disabled="selectedRange.code === ''"/>
                            </template>
                        </InputGroup>
                    </div>

                    <div class="flex-auto">
                        <InputGroup>
                            <Select v-model="selected" :options="selectList" optionLabel="name" placeholder="검색어 선택" />
                            <InputText :placeholder="selected.code === '' ? '검색어 선택해주세요.' : '검색어 입력해주세요.'" v-model="inputText" :disabled="selected.code === ''"/>
                            <Button label="검색" @click="searchBtn(selected, inputText, tradeDateRange, sortField, sortOrder, selectedRange, minAmount, maxAmount)" :disabled="!isButtonEnabled" />
                        </InputGroup>
                    </div>
                </div>
            </template>

            <template #empty> 데이터가 없습니다. </template>
            <template #loading> Loading data. Please wait. </template>
            <Column field="largeHoldingsName" header="내부자 이름" style="min-width: 12rem"></Column>
            <Column field="tradeReason" header="매매 이유" style="min-width: 12rem"></Column>
            <Column field="stockType" header="증권 종류" style="min-width: 12rem"></Column>
            <Column field="tradeDt" header="거래 날짜" :sortable="true" style="min-width: 12rem"></Column>
            <Column field="changeStockAmount" header="거래량" :sortable="true" style="min-width: 12rem">
                <template #body="slotProps">
                    {{ formatAccountingNumber(slotProps.data.changeStockAmount) }}주
                </template>
            </Column>
            <Column field="unitStockPrice" header="평단가" :sortable="true" style="min-width: 12rem">
                <template #body="slotProps">
                    {{ formatAccountingNumber(slotProps.data.unitStockPrice) }}원
                </template>
            </Column>
            <Column field="afterStockAmount" header="보유주식" :sortable="true" style="min-width: 12rem">
                <template #body="slotProps">
                    {{ formatAccountingNumber(slotProps.data.afterStockAmount) }}주
                </template>
            </Column>
            <Column field="url" header="URL" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button
                        label="Dart 공시 URL"
                        icon="pi pi-external-link"
                        class="p-button-outlined p-button-sm"
                        @click="windowOpen(slotProps.data.url)"
                    />
                </template>
            </Column>
        </DataTable>
        <Paginator
            :rows="rows"
            :totalRecords="totalRecords"
            :first="page * rows"
            @page="onPageChange($event, selected, inputText, tradeDateRange, sortField, sortOrder, selectedRange, minAmount, maxAmount)"
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
