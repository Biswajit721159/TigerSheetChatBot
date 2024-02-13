import axios from 'axios'
const api = process.env.REACT_APP_backendApi

export async function getEmployeeCountByDate(date) {
    try {
        const requestBody = {
           'date':date.date
        };
        let responce = await axios.post(`${api}/Leave/getEmployeeCountByDate`,requestBody)
        if(responce.data.length===0) return "We are unable to process your question currently."
        return responce.data
    } catch {
        return "We are unable to process your question currently."
    }
}

export async function getEmployeeNameByDate(date){
    try {
        const requestBody = {
           'date':date.date
        };
        let responce = await axios.post(`${api}/Leave/getEmployeeNameByDate`,requestBody)
        if(responce.data.length===0) return "We are unable to process your question currently."
        else return responce.data
    } catch {
        return "We are unable to process your question currently."
    }
}

export async function getEmployeeCountByYear(year){
    try {
        const requestBody = {
           'year':year.year
        };
        let responce = await axios.post(`${api}/Leave/getEmployeeCountByYear`,requestBody)
        if(responce.data.length===0) return "We are unable to process your question currently."
        else return responce.data
    } catch {
        return "We are unable to process your question currently."
    }
}

export async function getEmployeeNameByYear(year){
    try {
        const requestBody = {
           'year':year.year
        };
        let responce = await axios.post(`${api}/Leave/getEmployeeNameByYear`,requestBody)
        if(responce.data.length===0) return "We are unable to process your question currently."
        else return responce.data
    } catch {
        return "We are unable to process your question currently."
    }
}