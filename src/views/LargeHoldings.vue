<script setup>
import { LargeHoldingsDetailsService } from "@/service/LargeHoldingsDetailsService";
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, reactive, ref } from 'vue';


const largeHoldingsDetailList = ref([]);
const page = ref(0);
const totalRecords = ref(0);
const rows = ref(10);

const selectedCity = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);

const customers1 = ref(null);
const customers2 = ref(null);
const customers3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const balanceFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = reactive(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = reactive([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

function getOrderSeverity(order) {
    switch (order.status) {
        case 'DELIVERED':
            return 'success';

        case 'CANCELLED':
            return 'danger';

        case 'PENDING':
            return 'warn';

        case 'RETURNED':
            return 'info';

        default:
            return null;
    }
}

function getSeverity(status) {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warn';

        case 'renewal':
            return null;
    }
}

function getStockSeverity(product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}

onBeforeMount(() => {
    let params = {
        orderColumn : "tradeDt",
        isDescending: true,
        page : page.value,
        size : rows.value,
    };

    searchData(params);
});

// 필터 초기화
function initFilters1() {
    filters1.value = {
        global: {
            value: null,
            matchMode: FilterMatchMode.CONTAINS
        },
        // 내부자 이름
        largeHoldingsName: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        },
        // 직책(타입)
        // 'country.name': {
        //     operator: FilterOperator.AND,
        //     constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        // },
        // 매매 이유
        tradeReason: {
            value: null, matchMode: FilterMatchMode.IN
        },
        // 증권 종류
        stockType: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
        },
        // 거래 날짜
        tradeDt: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
        },
        // 거래량
        changeStockAmount: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        // 평단가
        unitStockPrice: {
            value: [0, 100], matchMode: FilterMatchMode.BETWEEN
        },
        // 보유주식
        verified: {
            value: null, matchMode: FilterMatchMode.EQUALS
        }
        // URL
    };
}

function expandAll() {
    expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
}

function collapseAll() {
    expandedRows.value = null;
}

function formatCurrency(value) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDate(value) {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function calculateCustomerTotal(name) {
    let total = 0;
    if (customers3.value) {
        for (let customer of customers3.value) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
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
                        <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="City" />
                        <InputText placeholder="Keyword" />
                        <Button label="Search" />
                    </InputGroup>
                </div>
            </template>

            <template #empty> 데이터가 없습니다. </template>
            <template #loading> Loading data. Please wait. </template>
            <Column field="largeHoldingsName" header="내부자 이름" style="min-width: 12rem"></Column>
            <!-- TODO : 직책 데어티 추가 및 UI 작업 필요 -->
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
            @page="onPageChange"
        />



        <!--        <DataTable-->
<!--            :value="largeHoldingsDetailList"-->
<!--            :paginator="true"-->
<!--            :rows="10"-->
<!--            dataKey="seq"-->
<!--            :rowHover="true"-->
<!--            v-model:filters="filters1"-->
<!--            filterDisplay="menu"-->
<!--            :loading="loading1"-->
<!--            :filters="filters1"-->
<!--            :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"-->
<!--            showGridlines-->
<!--        >-->
<!--            <template #header>-->
<!--                <div class="flex justify-between">-->
<!--                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />-->
<!--                    <IconField>-->
<!--                        <InputIcon>-->
<!--                            <i class="pi pi-search" />-->
<!--                        </InputIcon>-->
<!--                        <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />-->
<!--                    </IconField>-->
<!--                </div>-->
<!--            </template>-->
<!--            <template #empty> No customers found. </template>-->
<!--            <template #loading> Loading customers data. Please wait. </template>-->
<!--            <Column field="largeHoldingsName" header="내부자 이름" style="min-width: 12rem">-->
<!--                <template #body="{ data }">-->
<!--                    {{ data.largeHoldingsName }}-->
<!--                </template>-->
<!--                <template #filter="{ filterModel }">-->
<!--                    <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />-->
<!--                </template>-->
<!--            </Column>-->
<!--            <Column header="직책(타입)" filterField="country.name" style="min-width: 12rem">-->
<!--                <template #body="{ data }">-->
<!--                    <div class="flex items-center gap-2">-->
<!--                        <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" />-->
<!--                        <span>{{ data.country.name }}</span>-->
<!--                    </div>-->
<!--                </template>-->
<!--                <template #filter="{ filterModel }">-->
<!--                    <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />-->
<!--                </template>-->
<!--                <template #filterclear="{ filterCallback }">-->
<!--                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>-->
<!--                </template>-->
<!--                <template #filterapply="{ filterCallback }">-->
<!--                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>-->
<!--                </template>-->
<!--            </Column>-->
<!--            <Column header="매매 이유" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">-->
<!--                <template #body="{ data }">-->
<!--                    <div class="flex items-center gap-2">-->
<!--                        <img :alt="data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`" style="width: 32px" />-->
<!--                        <span>{{ data.representative.name }}</span>-->
<!--                    </div>-->
<!--                </template>-->
<!--                <template #filter="{ filterModel }">-->
<!--                    <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any">-->
<!--                        <template #option="slotProps">-->
<!--                            <div class="flex items-center gap-2">-->
<!--                                <img :alt="slotProps.option.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`" style="width: 32px" />-->
<!--                                <span>{{ slotProps.option.name }}</span>-->
<!--                            </div>-->
<!--                        </template>-->
<!--                    </MultiSelect>-->
<!--                </template>-->
<!--            </Column>-->
<!--            <Column header="증권 종류" filterField="date" dataType="date" style="min-width: 10rem">-->
<!--                <template #body="{ data }">-->
<!--                    {{ formatDate(data.date) }}-->
<!--                </template>-->
<!--                <template #filter="{ filterModel }">-->
<!--                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />-->
<!--                </template>-->
<!--            </Column>-->
<!--            <Column header="거래 날짜" filterField="balance" dataType="numeric" style="min-width: 10rem">-->
<!--                <template #body="{ data }">-->
<!--                    {{ formatCurrency(data.balance) }}-->
<!--                </template>-->
<!--                <template #filter="{ filterModel }">-->
<!--                    <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />-->
<!--                </template>-->
<!--            </Column>-->
<!--            <Column header="거래량" field="status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">-->
<!--                <template #body="{ data }">-->
<!--                    <Tag :value="data.status" :severity="getSeverity(data.status)" />-->
<!--                </template>-->
<!--                <template #filter="{ filterModel }">-->
<!--                    <Select v-model="filterModel.value" :options="statuses" placeholder="Select One" showClear>-->
<!--                        <template #option="slotProps">-->
<!--                            <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />-->
<!--                        </template>-->
<!--                    </Select>-->
<!--                </template>-->
<!--            </Column>-->
<!--            <Column field="activity" header="평단가" :showFilterMatchModes="false" style="min-width: 12rem">-->
<!--                <template #body="{ data }">-->
<!--                    <ProgressBar :value="data.activity" :showValue="false" style="height: 6px"></ProgressBar>-->
<!--                </template>-->
<!--                <template #filter="{ filterModel }">-->
<!--                    <Slider v-model="filterModel.value" range class="m-4"></Slider>-->
<!--                    <div class="flex items-center justify-between px-2">-->
<!--                        <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>-->
<!--                        <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>-->
<!--                    </div>-->
<!--                </template>-->
<!--            </Column>-->
<!--            <Column field="verified" header="보유주식" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">-->
<!--                <template #body="{ data }">-->
<!--                    <i class="pi" :class="{ 'pi-check-circle text-green-500 ': data.verified, 'pi-times-circle text-red-500': !data.verified }"></i>-->
<!--                </template>-->
<!--                <template #filter="{ filterModel }">-->
<!--                    <label for="verified-filter" class="font-bold"> Verified </label>-->
<!--                    <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary inputId="verified-filter" />-->
<!--                </template>-->
<!--            </Column>-->
<!--            <Column field="verified" header="URL" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">-->
<!--                <template #body="{ data }">-->
<!--                    <i class="pi" :class="{ 'pi-check-circle text-green-500 ': data.verified, 'pi-times-circle text-red-500': !data.verified }"></i>-->
<!--                </template>-->
<!--                <template #filter="{ filterModel }">-->
<!--                    <label for="verified-filter" class="font-bold"> Verified </label>-->
<!--                    <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary inputId="verified-filter" />-->
<!--                </template>-->
<!--            </Column>-->
<!--        </DataTable>-->
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
