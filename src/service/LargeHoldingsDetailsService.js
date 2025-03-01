export const LargeHoldingsDetailsService = {
    getSearchData(params) {
        const queryParams = params
            ? Object.keys(params)
                .map( (k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/search/large-holdings?${queryParams}`).then((res) => res.json());
    },

    getLargeHoldingsStockRatio(params) {
        const queryParams = params
            ? Object.keys(params)
                .map( (k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/large-holdings-stock-ratio?${queryParams}`).then((res) => res.json());
    },

    getLargeHoldingsMonthlyTradeCnt(params) {
        const queryParams = params
            ? Object.keys(params)
                .map( (k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/large-holdings-monthly-trade-cnt?${queryParams}`).then((res) => res.json());
    },

    getLargeHoldingsStockRatioTop5(params) {
        const queryParams = params
            ? Object.keys(params)
                .map( (k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/large-holdings-top-5?${queryParams}`).then((res) => res.json());
    },

    getLargeHoldingsTradeHistory(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/large-holdings-trade-history?${queryParams}`).then((res) => res.json());
    },
};
