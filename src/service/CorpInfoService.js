export const CorpInfoService = {
    getAllCorpInfoList(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k] || '')}`)
                .join('&')
            : '';
        return fetch(`${import.meta.env.VITE_APP_API_URL}/stock/corp-info-all?${queryParams}`).then((res) => res.json());
    },
};
