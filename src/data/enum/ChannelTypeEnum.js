export const ChannelTypeEnum = Object.freeze({
    STOCK_CHANGE_NOTIFY_LARGE_HOLDINGS  : "지분 공시 변동 - 대량보유 상황보고",
    STOCK_CHANGE_EXECOWNERSHIP          : "지분 공시 변동 - 지분 공시 변동 - 대량보유 상황보고",

    findByValue(value) {
        const entry = Object.entries(ChannelTypeEnum)
            .find(([key, val]) => val === value);

        return entry ? entry[0] : null;  // 찾으면 key (enum 이름), 아니면 null 반환
    }
});

