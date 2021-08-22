import dotProp from 'dot-prop-immutable'

const stateContainerId = 'levels/city/levelContainerContent'

const initialState = {}

const mapStateToProps = state => {
  const { dialogs, cityLevel } = state
  return {
    dialogs
  }
}

const reducer = (state = initialState, action) => {
  if (action.type.includes(stateContainerId)) {
    switch (action.type) {
      default:
        return state
    }
  }
  return state
}

const actionCreators = {}

const dispatchers = {}

const mapDispatchToProps = dispatch => ({
  actions: {}
})

export { reducer, mapStateToProps, actionCreators, dispatchers, mapDispatchToProps }
