<script setup>
import { TradeService } from "@/service/TradeService";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { DateUtil } from "@/utils/DateUtil";
import { MoneyUtil } from "@/utils/MoneyUtil";
import { CorpInfoIDBService } from "@/service/indexedDB/CorpInfoIDBService";
import { ClientIdIDBService } from "@/service/indexedDB/ClientIdIDBService";

const largeHoldingsTop5 = ref({
    buy: [],
    sell: [],
});

const execOwnershipTop5 = ref({
    buy: [],
    sell: [],
});

const router = useRouter();

onMounted(async () => {
    const initDateRangeObj = DateUtil.getDateRangeObj(180);

    await Promise.all([
        getTop5StockTrade({ tradeDtGoe: initDateRangeObj.startDate, tradeDtLoe: initDateRangeObj.endDate }),
        CorpInfoIDBService.getAllCorpInfoList(),
        ClientIdIDBService.getUUID(),
    ]);
});


function getTop5StockTrade(params) {
    TradeService.getTop5StockTrade(params).then((response) => {
        const execOwnership = response.data.execOwnership;
        const largeHoldings = response.data.largeHoldings;


        for (const { sellOrBuyType, top5StockDetailDTOList } of largeHoldings) {
            largeHoldingsTop5.value[sellOrBuyType] = top5StockDetailDTOList;
        }

        for (const { sellOrBuyType, top5StockDetailDTOList } of execOwnership) {
            execOwnershipTop5.value[sellOrBuyType] = top5StockDetailDTOList;
        }
    });
}

function movePage(event, stockType) {
    router.push({ name: stockType, query: { corpCode: event.data.corpCode } });
}

</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">대주주 매수 TOP 5 기업별(7일)</div>
                <DataTable
                    :value="largeHoldingsTop5.buy"
                    :rowHover="true"
                    showGridlines
                    @rowClick="movePage($event,'largeHoldings')"
                    selectionMode="single"
                >
                    <Column field="corpName" header="기업 이름" style="width: 35%"></Column>
                    <Column field="totalStockAmount" header="거래량(주)" style="width: 35%">
                        <template #body="slotProps">
                            {{ MoneyUtil.formatAccountingNumber(slotProps.data.totalStockAmount) }}주
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="card">
                <div class="font-semibold text-xl mb-4">임원 매수 TOP 5 기업별(7일)</div>
                <DataTable
                    :value="execOwnershipTop5.buy"
                    :rowHover="true"
                    showGridlines
                    @rowClick="movePage($event,'execOwnership')"
                    selectionMode="single"
                >
                    <Column field="corpName" header="기업 이름" style="width: 35%"></Column>
                    <Column field="totalStockAmount" header="거래량(주)" style="width: 35%">
                        <template #body="slotProps">
                            {{ MoneyUtil.formatAccountingNumber(slotProps.data.totalStockAmount) }}주
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">대주주 매도 TOP 5 기업별(7일)</div>
                <DataTable
                    :value="largeHoldingsTop5.sell"
                    :rowHover="true"
                    showGridlines
                    @rowClick="movePage($event,'largeHoldings')"
                    selectionMode="single"
                >
                    <Column field="corpName" header="기업 이름" style="width: 35%"></Column>
                    <Column field="totalStockAmount" header="거래량(주)" style="width: 35%">
                        <template #body="slotProps">
                            {{ MoneyUtil.formatAccountingNumber(slotProps.data.totalStockAmount) }}주
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="card">
                <div class="font-semibold text-xl mb-4">임원 매도 TOP 5 기업별(7일)</div>
                <DataTable
                    :value="execOwnershipTop5.sell"
                    :rowHover="true"
                    showGridlines
                    @rowClick="movePage($event,'execOwnership')"
                    selectionMode="single"
                >
                    <Column field="corpName" header="기업 이름" style="width: 35%"></Column>
                    <Column field="totalStockAmount" header="거래량(주)" style="width: 35%">
                        <template #body="slotProps">
                            {{ MoneyUtil.formatAccountingNumber(slotProps.data.totalStockAmount) }}주
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
