let { sheetId, FromId, ToId } = require('../Constant/constant')
const axios = require('axios');


const getEmployeeCountByYear = async (req, res) => {
    try {
        let year = req.body.year
        if(year.length==0){
            res.send("We Can not Process Your Request")
        }
        let result = await GetLeaveByYear(year)
        res.send(`Total No. Of Leave Record in ${year} is :- ${result.totalCount}`)
    } catch {
        res.send("We Can not Process Your Request")
    }
}

const getEmployeeNameByYear = async (req, res) => {
    try {
        let year = req.body.year
        if(year.length==0){
            res.send("We Can not Process Your Request")
        }
        let result = await GetLeaveByYear(year)
        let frequencyCounter = countFrequency(result)
        const mySet = new Set();
        let name = "Here is the Employee Name with his Leave count :- "
        name += '\n';
        for (let i = 0; i < result.data.length; i++) {
            let id = result.data[i]['Employee reference_id'];
            if (result.data[i]?.Employee && mySet.has(id) == false) {
                name += `${mySet.size + 1}. ${result.data[i].Employee}`
                name += ` with his ${frequencyCounter[id] == 1 ? 'Leave ' : "Leave's"} are - ${frequencyCounter[id]}`
                name += '\n'
                mySet.add(id)
            }
        }
        res.send(name)
    } catch {
        res.send("We Can not Process Your Request")
    }
}

function countFrequency(result) {
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
}

const GetLeaveByYear = async (year) => {
    if (year.length == 0) {
        return "We Can not Process Your Request"
    }
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
    try {
        const response = await axios.post(TiggerSheetApi, getpayload, { headers });
        return response.data
    } catch (error) {
        throw error;
    }
}

const getEmployeeCountByDate = async (req, res) => {
    try {
        let date = req.body?.date
        let data = await getLeave(date)
        res.send(`Total Person Leave on ${date} is :- ${data?.totalCount}`)
    } catch {
        res.send("We Can not Process Your Request")
    }
}

const getEmployeeNameByDate = async (req, res) => {
    try {
        let date = req.body?.date
        let data = await getLeave(date)
        data = data.data
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
        res.send("We Can not Process Your Request")
    }
}

async function getLeave(date) {
    if (date.length == 0) {
        return "We Can not Process Your Request"
    }

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
    try {
        const response = await axios.post(TiggerSheetApi, getpayload, { headers });
        return response.data
    } catch (error) {
        throw error;
    }
}


module.exports = { getEmployeeCountByDate, getEmployeeNameByDate, getEmployeeCountByYear, getEmployeeNameByYear }