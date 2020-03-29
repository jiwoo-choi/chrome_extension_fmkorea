import StorageController from '../StorageController.js'
const storageController = new StorageController("keyword");

import {
    FETCH_KEYWORDS, 
    FETCH_KEYWORDS_ERROR, 
    ADD_KEYWORDS, 
    ADD_KEYWORDS_ERROR, 
    REMOVE_KEYWORDS, 
    REMOVE_KEYWORDS_ERROR
} from './actionType.js'

//SYNC
// export const GET_KEYWORDS = 'GET_KEYWORDS';
export function fetchKeywords(items){
    return {
        type:FETCH_KEYWORDS,
        items
    }
}

// export const GET_KEYWORDS_ERROR = 'GET_KEYWORDS_ERROR';
export function fetchKeywordsError(errorMessage){
    return {
        type: FETCH_KEYWORDS_ERROR,
        errorMessage
    }
}

// export const ADD_KEYWORDS = 'ADD_KEYWORDS';
export function addKeywords(item){
    return {
        type: ADD_KEYWORDS,
        item
    }
}

// export const ADD_KEYWORDS_ERROR = 'ADD_KEYWORDS_ERROR'
export function addKeywordsError(errorMessage){
    return {
        type: ADD_KEYWORDS_ERROR,
        errorMessage
    }
}


// export const REMOVE_KEYWORDS = 'REMOVE_KEYWORDS';
export function removeKeywords(item){
    return {
        type: REMOVE_KEYWORDS,
        item
    }
}

// export const REMOVE_KEYWORDS_ERROR = 'REMOVE_KEYWORDS_ERROR';
export function removeKeywordsError(errorMessage){
    return {
        type: REMOVE_KEYWORDS_ERROR,
        errorMessage
    }
}


//ASYNC + with Side effects.
export function chromeFetchKeywords(){
    return (dispatch) => {
        storageController.getKeywordList().then( value => {
            dispatch(fetchKeywords(value));
        }).catch( reason => {
            dispatch(fetchKeywordsError(reason))
        })
    }
}

export function chromeAddKeywords(keyword){
    return (dispatch) => {
        storageController.saveKeywordFor(keyword)
            .then( value => {
                dispatch(addKeywords(keyword));
            })
            .catch( reason => {
                dispatch(addKeywordsError(reason))
            })
    }
}

export function chromeRemoveKeywords(keyword){
    return (dispatch) => {
        storageController.removeKeyword(keyword)
            .then( value => {
                dispatch(removeKeywords(keyword));
            })
            .catch( reason => {
                dispatch(removeKeywordsError(reason));
            })
    }
}

