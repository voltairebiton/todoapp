import Vuex from "vuex";

const createStore = () => {
    return new Vuex.Store({
        state: {
            pending: [],
            completed: []
        },
        mutations: {
            setPending(state, payload) {
                state.token = payload
            },
        },
        getters: {
            getPending(state) {
                return state.pending
            },
            getCompleted(state) {
                return state.completed
            },
        }
    });
};


export default createStore;
