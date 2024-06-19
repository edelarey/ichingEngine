import toolBarNotification from '../../helpers/ToolBarNotification';

export const state = () => ({
    all: [],
});

export const mutations = {
    add(state, NewToolBarNotification) {
        state.all.push(NewToolBarNotification);
    },
    clear(state) {
        state.all = [];
    },
};

export const getters = {};
export const actions = {
    add({ commit }, NewToolBarNotification) {
        commit('add', NewToolBarNotification);
    },
    clear({ commit }) {
        commit('clear');
    },
    addRaw({ commit }, notification) {
        let NewToolBarNotification = toolBarNotification.createNotification(
            notification.Icon,
            notification.HeaderText,
            notification.BodyText,
            notification.dateCreated,
        );
        commit('add', NewToolBarNotification);
    },
};
