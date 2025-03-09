import { ChannelTypeEnum } from "@/data/enum/ChannelTypeEnum";

export const PushService = {
    eventSource: null,

    /**
     * SSE 연결 시작
     * @param {function} onMessage - 메시지 수신 시 실행할 콜백 함수
     * @param {function} onError - 에러 발생 시 실행할 콜백 함수 (선택적)
     */
    async connect(onMessage, onError = console.error) {
        if (this.eventSource) {
            console.warn("이미 SSE 연결이 활성화되어 있습니다.");
            return;
        }

        // 알림 권한 확인 및 요청
        await this.requestNotificationPermission();

        this.eventSource = new EventSource(`${import.meta.env.VITE_APP_API_URL}/push/get-flux-message`);

        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);


                this.showNotification(data);
                onMessage(data);
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

    async requestNotificationPermission() {
        if (!("Notification" in window)) {
            console.error("이 브라우저는 알림을 지원하지 않습니다.");
            return;
        }


        if (Notification.permission !== "granted") {
            try {
                const permission = await Notification.requestPermission();
                console.log("알림 권한: ", permission);
            } catch (error) {
                console.error("알림 권한 요청 중 오류 발생: ", error);
            }
        }
    },

    /**
     * 웹 알림 생성
     */
    showNotification(messageDTO) {
        let title = "";
        let body = "";
        let routerName = "";

        switch (messageDTO.channelType) {
            case ChannelTypeEnum.STOCK_CHANGE_NOTIFY_LARGE_HOLDINGS.code:
                title = `${messageDTO.message} 지분공시 변경됐어요!`
                body = `클릭하면 상세로 이동합니다.`
                routerName = 'large-holding';
                break;
            case ChannelTypeEnum.STOCK_CHANGE_EXECOWNERSHIP.code:
                title = `${message} 지분공시 변경됐어요!`
                body = `클릭하면 상세로 이동합니다.`
                routerName = 'exec-ownership';
                break;
            default:
                return;
        }


        if (Notification.permission === "granted") {
            const notification = new Notification(title, { body: body });
            const currentDomain = window.location.origin;

            notification.onclick = () => {
                const targetUrl = `${currentDomain}/${routerName}?corpCode=${messageDTO.corpCode}`;
                window.open(targetUrl, "_blank");
            };
        }
    },
};
