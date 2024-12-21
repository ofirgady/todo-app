
export const UPDATE_LAYOUT_PREFS = 'UPDATE_LAYOUT_PREFS'

export const initialLayoutState = {
    prefs: {
        color: '#000000', // Default text color
        bgColor: '#ffffff', // Default background color
    },
}

export function layoutReducer(state = initialLayoutState, cmd = {}) {
    switch (cmd.type) {
        case UPDATE_LAYOUT_PREFS:
            return {
                ...state,
                prefs: {...state.prefs, ...cmd.prefs}
            }
        default:
            return state
    }
}
