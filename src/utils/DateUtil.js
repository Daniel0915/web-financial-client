export const DateUtil = {
    getDateRangeObj(days) {
        if (!days) {
            return { startDate: '', endDate: '', };
        }

        days = Number(days);
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (days -1));

        return {
            startDate: this.formatDate(startDate),
            endDate: this.formatDate(today)
        }
    },

    formatDate(date) {
        if (!date) {
            return '';
        }

        date = new Date(date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
}
