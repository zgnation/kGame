const actions = {
  modelAction(context, num) {
    context.commit('MODEL_CONFIG', num)
  }
}

export default actions
