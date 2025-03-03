export const TradeService = {
    getTop5StockTrade(params) {
        const queryParams = params
            ? Object.keys(params)
                .map( (k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/trade-top-5?${queryParams}`).then((res) => res.json());
    },

    getTopStockTradeTotal(params) {
        const queryParams = params
            ? Object.keys(params)
                .map( (k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/trade-total?${queryParams}`).then((res) => res.json());
    },
};
