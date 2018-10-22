export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    comcode: '',
    comname: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updatecomCode (state, comcode) {
      state.comcode = comcode
    },
    updatecomName (state, comname) {
      state.comname = comname
    }
  }
}
