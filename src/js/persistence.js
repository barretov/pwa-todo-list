'use strict';

const DB_NAME = 'db_lists';
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
var db;

function openDb() {
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    // console.log("openDb ...");

    req.onsuccess = function (evt) {
        db = this.result;
        console.log("openDb DONE");
        showItems();
    };

    req.onerror = function (evt) {
        console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
        console.log("openDb.onupgradeneeded");
        let store = evt.currentTarget.result.createObjectStore('list', {keyPath: 'id', autoIncrement: true});
            store.createIndex('name', 'name', {unique: false});

        store = evt.currentTarget.result.createObjectStore('product', { keyPath: 'id', autoIncrement: true });
            store.createIndex('lst_id', 'lst_id', {unique: false});
            store.createIndex('name', 'name', {unique: false});
            store.createIndex('done', 'done', {unique: false});
    };
}

 function getObjectStore(db_store, mode) {
    console.log("store é: ");
    console.log(db_store);
    return db.transaction(db_store, mode).objectStore(db_store);
}

function getStore () {
    return app.lst_id? 'product' : 'list';
}

function saveItem(item) {
    try {
        store = getObjectStore(getStore(), 'readwrite');
        let req = store.add(item);

        req.onsuccess = function (evt) {
            // console.log("Insertion in DB successful");
        };

        req.onerror = function() {
            // console.error("addPublication error", this.error);
        };
    } catch (exp) {
        if (exp.name == 'DataCloneError') {
            console.log("Error during the save.");
        }
        throw exp;
    }
}

function getList(lst_id) {
    try {
        let store = getObjectStore(getStore(), 'readonly');

        if (lst_id) {
            store.index("lst_id").openCursor().onsuccess = function(evt) {

                if (evt.target.result) {
                    if (evt.target.result.value.lst_id == lst_id)
                        mountItems(evt.target.result.value);
                        evt.target.result.continue();
                }
            }
            return;
        }

        store.openCursor().onsuccess = function(evt) {
            if (evt.target.result) {
                mountItems(evt.target.result.value);
                evt.target.result.continue();
            }
        }
    } catch (exp) {
        throw console.log("Sorry... Error: " + exp);
    }
}

function delItem(id) {
    getObjectStore(getStore(), 'readwrite').delete(id).onsuccess = function(evt) {
        // console.log("deletado");
    }
}

function editItem(data) {
    getObjectStore(getStore(), 'readwrite').put(data).onsuccess = function(evt) {
        // console.log("Editado");
    }
}

function getItemData(id, callback) {
   let req = getObjectStore(getStore(), 'readonly').get(id);
   req.onsuccess = function(evt) {
       callback(req.result);
   }
}

openDb();
