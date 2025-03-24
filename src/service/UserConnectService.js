
export const UserConnectService = {
    eventSource: null,

    /**
     * SSE 연결 시작
     * @param uuid - 비회원 고유 넘버
     * @param {function} onViewCnt - 뷰 카운트 실행할 콜백 함수
     * @param {function} onError - 에러 발생 시 실행할 콜백 함수 (선택적)
     */
    async getUserViewCnt(uuid, onViewCnt, onError = console.error) {
        if (this.eventSource) {
            console.warn("이미 SSE 연결이 활성화되어 있습니다.");
            return;
        }

        this.eventSource = new EventSource(`${import.meta.env.VITE_APP_API_URL}/user/connect/${uuid}`);

        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onViewCnt(data);
            } catch (error) {
                console.error("메시지 파싱 오류: ", error);
            }
        };

        this.eventSource.onerror = (error) => {
            console.error("SSE 연결 오류: ", error);
            onError(error);
            this.close();
        };
    },

    /**
     * SSE 연결 종료
     */
    close() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
            console.log("🔌 SSE 연결 종료");
        }
    },

    /**
     * SSE 연결 상태 확인
     * @returns {boolean} - 연결 여부
     */
    isConnected() {
        return this.eventSource !== null;
    },
};
