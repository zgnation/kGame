import {
  MODEL_CONFIG
} from './mutation-type'

export default {
  [MODEL_CONFIG](state, value) {
    console.log('state', state)
    state.modelConfig = value
  }
}
