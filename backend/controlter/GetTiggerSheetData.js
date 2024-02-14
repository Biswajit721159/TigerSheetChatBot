let { sheetId, FromId, ToId } = require('../Constant/constant')
const axios = require('axios');

let errormess = "while processing your request we are geting some error"
let limit = 1e7

//For Time Range 

const getEmployeeCountByTwoDate = async (req, res) => {
    try {
        let startdate = req.body.startdate;
        let lastdate = req.body.lastdate;
        if (startdate.length == 0 && lastdate.length == 0) {
            return res.send("Starting Date and Last Date are required")
        }
        if (startdate.length == 0) {
            return res.send("Starting Date is required")
        }
        if (lastdate.length == 0) {
            return res.send("Last Date is required")
        }
        if (await CompairTwoDate(startdate, lastdate) == true) {
            [startdate, lastdate] = [lastdate, startdate];
        }
        let result = await GetLeaveByTwoDate(startdate, lastdate);
        let frequencyCounter = countFrequency(result);
        if (result.totalCount == 0) return res.send(`No Person are Found with in ${startdate} to ${lastdate}`)
        return res.send(`Total number of leave record from ${startdate} to ${lastdate} is ${result.totalCount} ,involving ${Object.keys(frequencyCounter).length} person`);
    } catch {
        return res.send(errormess)
    }
}

const getEmployeeNameByTwoDate = async (req, res) => {
    try {
        let startdate = req.body.startdate;
        let lastdate = req.body.lastdate;
        if (startdate.length == 0 && lastdate.length == 0) {
            return res.send("Starting Date and Last Date are required")
        }
        if (startdate.length == 0) {
            return res.send("Starting Date is required")
        }
        if (lastdate.length == 0) {
            return res.send("Last Date is required")
        }
        if (await CompairTwoDate(startdate, lastdate) == true) {
            [startdate, lastdate] = [lastdate, startdate];
        }
        let result = await GetLeaveByTwoDate(startdate, lastdate);
        if (result.data.length == 0) {
            return res.send(`From ${startdate} to ${lastdate} we are getting 0 record`)
        }
        let frequencyCounter = countFrequency(result);
        const mySet = new Set();
        let name = `Here are the employee names along with their leave counts between ${startdate} and ${lastdate}: `
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
        return res.send(name)
    } catch {
        return res.send(errormess)
    }
}

const CompairTwoDate = async (startdate, lastdate) => {
    startdate = new Date(startdate);
    lastdate = new Date(lastdate);
    if (startdate > lastdate) {
        return true
    }
    return false
}

const GetLeaveByTwoDate = async (startdate, lastdate) => {
    try {
        const TiggerSheetApi = process.env.TiggerSheetApi;
        const TigerSheetApiKey = process.env.TigerSheetApiKey;
        const headers = {
            'Authorization': TigerSheetApiKey,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        let day = await FindDefferentBetweenTwodate(startdate, lastdate);
        let criteria = `(DATE(sheet_${sheetId}.column_${FromId}) >= DATE_SUB('${lastdate}', INTERVAL ${day} DAY) AND DATE(sheet_${sheetId}.column_${FromId}) <= '${lastdate}')`
        let getpayload = {
            "sheet_id": sheetId,
            "criteria": criteria,
            "limit": limit
        };
        const response = await axios.post(TiggerSheetApi, getpayload, { headers });
        return response.data
    } catch {
        return errormess
    }
}

function FindDefferentBetweenTwodate(startdate, lastdate) {
    try {
        const date1 = new Date(startdate);
        const date2 = new Date(lastdate);
        const differenceMs = Math.abs(date1 - date2);
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24)) + 1;
        return differenceDays;
    } catch {
        return errormess
    }
}


//first section 
const getEmployeeCountByYear = async (req, res) => {
    try {
        let year = req.body.year
        if (year.length == 0) {
            return res.send("We can not found any year")
        }
        let result = await GetLeaveByYear(year)
        if (result.totalCount == 0) {
            return res.send(`Total no. of Leave Record in ${year} is 0`)
        }
        let frequencyCounter = countFrequency(result)
        return res.send(`Total no. Of leave record in ${year} is ${result.totalCount}, involving ${Object.keys(frequencyCounter).length} person`)
    } catch {
        return res.send(errormess)
    }
}

const getEmployeeNameByYear = async (req, res) => {
    try {
        let year = req.body.year
        if (year.length == 0) {
            return res.send("We can not found any year")
        }
        let result = await GetLeaveByYear(year)
        if (result.data.length == 0) {
            return res.send(`Total no. of Leave Record in ${year} is 0`)
        }
        let frequencyCounter = countFrequency(result)
        const mySet = new Set();
        let name = `Here is the Employee Name with Leave count in ${year}- `
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
        return res.send(name)
    } catch {
        return res.send(errormess)
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
            "criteria": `YEAR(sheet_${sheetId}.column_${FromId})=YEAR('${lastdate}')`,
            "limit": limit
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
            return res.send("We are not found any date")
        }
        let weekend = await isWeekend(date)
        if (weekend == true) {
            return res.send(`${date} is a weekend day`)
        }
        let data = await getLeave(date)
        if (data.totalCount == 0) return res.send(`we are not found any leave record`)
        return res.send(`Total Person Leave on ${date} is : ${data?.totalCount}`)
    } catch {
        return res.send(errormess)
    }
}

const getEmployeeNameByDate = async (req, res) => {
    try {
        let date = req.body?.date
        if (date.length == 0) {
            return res.send("We are not found any date")
        }
        if (await isWeekend(date)) {
            return res.send(`${date} is a weekend day`)
        }
        let data = await getLeave(date)
        data = data.data
        if (data.length == 0) return res.send(`We are not found person who are leave in ${date}`)
        let name = `Those Person who are Leave on ${date} is: `
        name += '\n'
        for (let i = 0; i < data?.length; i++) {
            if (data[i]?.Employee) {
                name += `${i + 1}. ${data[i].Employee}`
                name += '\n'
            }
        }
        return res.send(name)
    } catch {
        return res.send(errormess)
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
            "criteria": `DATE(sheet_${sheetId}.column_${FromId})<='${date}' and DATE(sheet_${sheetId}.column_${ToId})>='${date}'`,
            "limit": limit
        };
        const response = await axios.post(TiggerSheetApi, getpayload, { headers });
        return response.data
    } catch (error) {
        throw error;
    }
}

const isWeekend = async (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    var dayOfWeek = date.getDay();
    return (dayOfWeek === 6 || dayOfWeek === 0);
}

module.exports = { getEmployeeCountByDate, getEmployeeNameByDate, getEmployeeCountByYear, getEmployeeNameByYear, getEmployeeCountByTwoDate, getEmployeeNameByTwoDate }