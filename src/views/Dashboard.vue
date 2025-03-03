<script setup>
import { TradeService } from "@/service/TradeService";
import { computed, ref, onMounted } from "vue";
import { DateUtil } from "@/utils/DateUtil";
import { MoneyUtil } from "@/utils/MoneyUtil";
import { CorpInfoIndexedDBService } from "@/service/indexedDB/CorpInfoIndexedDBService";

const largeHoldingsTop5 = ref({
    buy: [],
    sell: [],
});

onMounted(async () => {
    const initDateRangeObj = DateUtil.getDateRangeObj(180);

    await Promise.all([
        getTop5StockTrade({ tradeDtGoe: initDateRangeObj.startDate, tradeDtLoe: initDateRangeObj.endDate }),
        CorpInfoIndexedDBService.getAllCorpInfoList()
    ]);
});


function getTop5StockTrade(params) {
    TradeService.getTop5StockTrade(params).then((response) => {
        for (const { sellOrBuyType, top5StockDetailDTOList } of response.data) {
            largeHoldingsTop5.value[sellOrBuyType] = top5StockDetailDTOList;
        }
    });
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
                >
                    <Column field="corpName" header="기업 이름" style="width: 35%"></Column>
                    <Column field="totalStockAmount" header="거래량(주)" style="width: 35%">
                        <template #body="slotProps">
                            {{ MoneyUtil.formatAccountingNumber(slotProps.data.totalStockAmount) }}주
                        </template>
                    </Column>
                    <Column field="totalStockPrice" header="거래 금액" style="width: 35%">
                        <template #body="slotProps">
                            {{ MoneyUtil.formatAccountingNumber(slotProps.data.totalStockPrice) }}원
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="card">
                <div class="font-semibold text-xl mb-4">임원 매수 TOP 5 기업별(7일)</div>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">대주주 매도 TOP 5 기업별(7일)</div>
                <DataTable
                    :value="largeHoldingsTop5.sell"
                    :rowHover="true"
                    showGridlines
                >
                    <Column field="corpName" header="기업 이름" style="width: 35%"></Column>
                    <Column field="totalStockAmount" header="거래량(주)" style="width: 35%">
                        <template #body="slotProps">
                            {{ MoneyUtil.formatAccountingNumber(slotProps.data.totalStockAmount) }}주
                        </template>
                    </Column>
                    <Column field="totalStockPrice" header="거래 금액" style="width: 35%">
                        <template #body="slotProps">
                            {{ MoneyUtil.formatAccountingNumber(slotProps.data.totalStockPrice) }}원
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="card">
                <div class="font-semibold text-xl mb-4">임원 매도 TOP 5 기업별(7일)</div>
            </div>
        </div>
    </div>
</template>
