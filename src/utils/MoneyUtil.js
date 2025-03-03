export const MoneyUtil = {
    formatAccountingNumber(number) {
        number = Number(number);
        const absNumber = Math.abs(number).toLocaleString("en-US"); // 천 단위 콤마 추가
        // 음수는 괄호로 표시, 양수는 그대로 표시
        return number < 0 ? `(${absNumber})` : absNumber;
    }
};
