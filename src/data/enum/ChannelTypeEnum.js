export const ChannelTypeEnum = Object.freeze({
    STOCK_CHANGE_NOTIFY_LARGE_HOLDINGS: {
        code: "STOCK_CHANGE_NOTIFY_LARGE_HOLDINGS",
        desc: "지분 공시 변동 - 대량보유 상황보고"
    },
    STOCK_CHANGE_EXECOWNERSHIP: {
        code: "STOCK_CHANGE_EXECOWNERSHIP",
        desc: "지분 공시 변동 - 임원소유 상황보고"
    },

    findByValue(value) {
        const entry = Object.entries(ChannelTypeEnum)
            .find(([_, obj]) => obj.desc === value);

        return entry ? entry[1] : null;  // 찾으면 { code, desc } 객체 반환, 아니면 null
    },

    findByCode(code) {
        const entry = Object.entries(ChannelTypeEnum)
            .find(([_, obj]) => obj.code === code);

        return entry ? entry[1] : null;  // 찾으면 { code, desc } 객체 반환, 아니면 null
    }
});
