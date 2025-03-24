const DB_NAME           = "user";
const DB_VERSION        = 1;
const OBJECT_STORE_NAME = "clientId";
const READ_ONLY         = "readonly";
const READ_WRITE        = "readwrite";
const UUID              = "UUID";

export const ClientIdIDBService = {
    openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => reject(event.target.error);


            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
                    const objectStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: UUID });
                    objectStore.createIndex(UUID, UUID, { unique: true });
                }
            };

            request.onsuccess = (event) => resolve(event.target.result);
        })
    },

    saveToIndexedDB(db, data){
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([OBJECT_STORE_NAME], READ_WRITE);
            const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

            objectStore.add({ UUID: data });

            transaction.oncomplete = () => resolve();
            transaction.onerror = (event) => reject(event.target.error);
        });
    },

    async getUUID() {
        const db = await this.openIndexedDB();
        const transaction = db.transaction([OBJECT_STORE_NAME], READ_ONLY);
        const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
        const getRequest = objectStore.getAll();

        return new Promise((resolve, reject) => {
            getRequest.onsuccess = async () => {
                if (getRequest.result.length > 0) {
                    resolve(getRequest.result[0].UUID);
                } else {
                    const newUUID = crypto.randomUUID();
                    await this.saveToIndexedDB(db, newUUID);
                    resolve(newUUID);
                }
            };

            getRequest.onerror = (event) => reject(event.target.error);
        });
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


};

