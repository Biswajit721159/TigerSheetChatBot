let { sheetId, FromId, ToId } = require('../Constant/constant')
const axios = require('axios');

let errormess = "We Can not Process Your Request Right Now"

//first section 
const getEmployeeCountByYear = async (req, res) => {
    try {
        let year = req.body.year
        if (year.length == 0) {
            res.send(errormess)
        }
        let result = await GetLeaveByYear(year)
        if (result.totalCount == 0) {
            res.send(errormess)
        }
        res.send(`Total No. Of Leave Record in ${year} is :- ${result.totalCount}`)
    } catch {
        res.send(errormess)
    }
}

const getEmployeeNameByYear = async (req, res) => {
    try {
        let year = req.body.year
        if (year.length == 0) {
            res.send(errormess)
        }
        let result = await GetLeaveByYear(year)
        if (result.data.length == 0) {
            res.send(errormess)
        }
        let frequencyCounter = countFrequency(result)
        const mySet = new Set();
        let name = `Here is the Employee Name with Leave count in ${year} :- `
        name += '\n';
        for (let i = 0; i < result.data.length; i++) {
            let id = result.data[i]['Employee reference_id'];
            if (result.data[i]?.Employee && mySet.has(id) == false) {
                name += `${mySet.size + 1}. ${result.data[i].Employee}`
                name += `  ${frequencyCounter[id] == 1 ? 'Leave ' : "Leave's"} are - ${frequencyCounter[id]}`
                name += '\n'
                mySet.add(id)
            }
        }
        res.send(name)
    } catch {
        res.send(errormess)
    }
}

function countFrequency(result) {
    try {
        let frequencyCounter = {};
        for (let i = 0; i < result.data.length; i++) {
            let id = result.data[i]['Employee reference_id'];
            let day = parseInt(result.data[i]['Number of Days']);
            if (frequencyCounter[id]) {
                frequencyCounter[id] += day;
            } else {
                frequencyCounter[id] = day
            }
        }
        return frequencyCounter;
    } catch {
        return errormess
    }
}

const GetLeaveByYear = async (year) => {
    try {
        const TiggerSheetApi = process.env.TiggerSheetApi;
        const TigerSheetApiKey = process.env.TigerSheetApiKey;

        const headers = {
            'Authorization': TigerSheetApiKey,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        let lastdate = `${year}-12-31`

        let getpayload = {
            "sheet_id": sheetId,
            "criteria": `YEAR(sheet_${sheetId}.column_${FromId})=YEAR('${lastdate}')`
        };
        const response = await axios.post(TiggerSheetApi, getpayload, { headers });
        return response.data
    } catch (error) {
        return errormess
    }
}


//second section 

const getEmployeeCountByDate = async (req, res) => {
    try {
        let date = req.body?.date
        if (date.length == 0) {
            return errormess
        }
        let data = await getLeave(date)
        if (data.totalCount == 0) res.send(errormess)
        res.send(`Total Person Leave on ${date} is :- ${data?.totalCount}`)
    } catch {
        res.send(errormess)
    }
}

const getEmployeeNameByDate = async (req, res) => {
    try {
        let date = req.body?.date
        if (date.length == 0) {
            return errormess
        }
        let data = await getLeave(date)
        data = data.data
        if (data.length == 0) res.send(errormess)
        let name = `Those Person who are Leave on ${date} is :-`
        name += '\n'
        for (let i = 0; i < data?.length; i++) {
            if (data[i]?.Employee) {
                name += `${i + 1}. ${data[i].Employee}`
                name += '\n'
            }
        }
        res.send(name)
    } catch {
        res.send(errormess)
    }
}

async function getLeave(date) {
    try {
        const TiggerSheetApi = process.env.TiggerSheetApi;
        const TigerSheetApiKey = process.env.TigerSheetApiKey;
        const headers = {
            'Authorization': TigerSheetApiKey,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        let getpayload = {
            "sheet_id": sheetId,
            "criteria": `DATE(sheet_${sheetId}.column_${FromId})<='${date}' and DATE(sheet_${sheetId}.column_${ToId})>='${date}'`
        };
        const response = await axios.post(TiggerSheetApi, getpayload, { headers });
        return response.data
    } catch (error) {
        throw error;
    }
}


module.exports = { getEmployeeCountByDate, getEmployeeNameByDate, getEmployeeCountByYear, getEmployeeNameByYear }