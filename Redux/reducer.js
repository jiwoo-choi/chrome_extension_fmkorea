import {
    FETCH_KEYWORDS, 
    FETCH_KEYWORDS_ERROR, 
    ADD_KEYWORDS, 
    ADD_KEYWORDS_ERROR, 
    REMOVE_KEYWORDS, 
    REMOVE_KEYWORDS_ERROR
} from './actionType.js'

export function reducer(previousState, action) {
    switch(action.type) {
        case FETCH_KEYWORDS:
            return {
                ...previousState,
                items:action.items,
                error:false,
            }
        case FETCH_KEYWORDS_ERROR:
            return {
                ...previousState,
                error:true,
                errorMessage:action.errorMessage
            }
        case ADD_KEYWORDS:
            return {
                ...previousState,
                items:previousState.items.concat(action.item),
                error:false
            }
        case ADD_KEYWORDS_ERROR:
            return {
                ...previousState,
                error:true,
                errorMessage:action.errorMessage
            }
        case REMOVE_KEYWORDS:
            return {
                ...previousState,
                items:previousState.items.filter(element => {return element != action.item}),
                error:false,
            }
        case REMOVE_KEYWORDS_ERROR:
            return {
                ...previousState,
                error:true,
                errorMessage:action.errorMessage
            }
    }
}

