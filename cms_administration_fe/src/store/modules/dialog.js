const state = {
  isShowDialogAddUser: false,
  isShowDialogAddAchievement: false,
  event_id: null,
  event_object: {
    is_global: null
  }
}

const mutations = {
  // add user event
  SHOW_DIALOG_ADD_USER: (state, id) => {
    state.event_id = id
    state.isShowDialogAddUser = true
  },
  HIDE_DIALOG_ADD_USER: state => {
    state.event_id = null
    state.isShowDialogAddUser = false
  },
  // add achievement event
  SHOW_DIALOG_ADD_ACHIEVEMENT: (state, object) => {
    console.log('object............', object)
    state.event_id = object.id
    state.event_object = object
    console.log('state.event_object............', state.event_object)

    state.isShowDialogAddAchievement = true
  },
  HIDE_DIALOG_ADD_ACHIEVEMENT: state => {
    state.event_id = null
    state.event_object = { is_global: null }
    state.isShowDialogAddAchievement = false
  }
}

const actions = {
  showDialogAddUser(context, id) {
    context.commit('SHOW_DIALOG_ADD_USER', id)
  },
  hideDialogAddUser(context) {
    context.commit('HIDE_DIALOG_ADD_USER')
  },
  showDialogAddAchievement(context, object) {
    context.commit('SHOW_DIALOG_ADD_ACHIEVEMENT', object)
  },
  hideDialogAddAchievement(context) {
    context.commit('HIDE_DIALOG_ADD_ACHIEVEMENT')
  }
}

export default {
  state,
  mutations,
  actions
}

