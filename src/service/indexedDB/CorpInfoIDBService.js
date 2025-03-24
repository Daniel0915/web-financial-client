import { CorpInfoService } from "@/service/CorpInfoService";

const DB_VERSION        = 1;
const DB_NAME           = "stock";
const OBJECT_STORE_NAME = "corpInfo";
const READ_ONLY         = "readonly";
const READ_WRITE        = "readwrite";
const CORP_CODE          = "corpCode";

export const CorpInfoIDBService = {
    // IndexedDB 열기
    openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => reject(event.target.error);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
                    const objectStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: CORP_CODE });
                    objectStore.createIndex(CORP_CODE, CORP_CODE, { unique: true });
                }
            };

            request.onsuccess = (event) => resolve(event.target.result);
        });
    },

    async getAllCorpInfoList() {
        // 1. IndexedDB 열기 (Promise 로 변환)
        const db = await this.openIndexedDB();

        // 2. 데이터 개수 확인
        const recordCount = await this.countRecords(db);

        // 3. 데이터가 없으면 API 호출 후 저장
        if (recordCount === 0) {
            const response = await CorpInfoService.getAllCorpInfoList();
            await this.saveToIndexedDB(db, response.data);
            return response.data;
        }

        // 4. IndexedDB 에서 데이터 읽기
        return await this.getAllFromIndexedDB(db);
    },

    // IndexedDB 에서 데이터 개수 확인
    countRecords(db) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([OBJECT_STORE_NAME], READ_ONLY);
            const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
            const countRequest = objectStore.count();

            countRequest.onsuccess = () => resolve(countRequest.result);
            countRequest.onerror = (event) => reject(event.target.error);
        });
    },

    // IndexedDB에 데이터 저장
    saveToIndexedDB(db, data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([OBJECT_STORE_NAME], READ_WRITE);
            const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

            for (const { corpCode, corpName } of data) {
                objectStore.add({ corpCode: corpCode, corpName: corpName });
            }

            transaction.oncomplete = () => resolve();
            transaction.onerror = (event) => reject(event.target.error);
        });
    },

    // IndexedDB 에서 모든 데이터 가져오기
    getAllFromIndexedDB(db) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([OBJECT_STORE_NAME], READ_ONLY);
            const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = (event) => reject(event.target.error);
        });
    },

    async getByCorpCodeList(corpCodeList) {
        if (!corpCodeList) {
            return [];
        }

        // 1. IndexedDB 열기 (Promise 로 변환)
        const db = await this.openIndexedDB();

        const transaction = db.transaction([OBJECT_STORE_NAME], READ_ONLY);
        const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

        let corpInfoList = [];
        for (let corpCode of corpCodeList) {
            const getRequest = objectStore.get(corpCode);
            getAllRequest.onsuccess = () => resolve(corpInfoList.puhs(getRequest.result));
            getAllRequest.onerror = (event) => reject(event.target.error);
        }

        return corpInfoList;
    },

    async getByCorpCode(corpCode) {
        if (!corpCode) {
            return {};
        }

        // 1. IndexedDB 열기 (Promise 로 변환)
        const db = await this.openIndexedDB();

        const transaction = db.transaction([OBJECT_STORE_NAME], READ_ONLY);
        const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

        const getRequest = objectStore.get(corpCode);

        return new Promise((resolve, reject) => {
            getRequest.onsuccess = () => resolve(getRequest.result || {});
            getRequest.onerror = (event) => reject(event.target.error);
        });
    }
};
