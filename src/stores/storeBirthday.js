// use pinia to store the last hexagram generated in consultation
// store only the binary string aspect of the hexagram

// Path: src/const/state.js
import { defineStore } from 'pinia';
import _ from 'lodash';
import { DateTime } from 'luxon';

const LOCAL_STORAGE_KEY = 'birthdayList';

function loadFromLocalStorage() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

function saveToLocalStorage(data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

export const useBirthdayStore = defineStore('birthday', {
    state: () => ({
        list: loadFromLocalStorage() || [{            
            name: 'Ed',
            birthday: DateTime.fromObject({ year: 1971, month: 3, day: 3, hour: 10, minute:30}).toISO(),  
            gender: 'MALE',
            coords: { 
                latitude: '-26.3966',
                longitude: '27.3768', 
            },
        }],        
    }),
    getters: {
        getBirthdayList() {
            return this.list;
        },
        getBirthday() {
            return (name) => this.list.find(birthday => _.toLower(birthday.name) === _.toLower(name)) || {};
        },
    },
    actions: {
        setBirthdayList(birthdayList) {       
            this.list = birthdayList;
            saveToLocalStorage(this.list);
        },
        addBirthday(birthday) {
            // first check the birthday by name, don't allow duplicates
            if (this.list.find(b => _.toLower(b.name) === _.toLower(birthday.name))) {
                // remove the duplicate birthday
                this.list = this.list.filter(b => _.toLower(b.name) !== _.toLower(birthday.name));            
            }
            this.list.push(birthday);
            saveToLocalStorage(this.list);
        },
        removeBirthday(name) {
            this.list = this.list.filter(birthday => _.toLower(birthday.name) !== _.toLower(name));
            saveToLocalStorage(this.list);
        },
    },
});