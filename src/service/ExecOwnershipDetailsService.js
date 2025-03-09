export const ExecOwnershipDetailsService = {
    getSearchData(params) {
        const queryParams = params
            ? Object.keys(params)
                .map( (k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/search/exec-ownership?${queryParams}`).then((res) => res.json());
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

    getStockRatioTop5(params) {
        const queryParams = params
            ? Object.keys(params)
                .map( (k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/exec-ownership-top-5?${queryParams}`).then((res) => res.json());
    },

    getTradeHistory(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/exec-ownership-trade-list?${queryParams}`).then((res) => res.json());
    },
};
