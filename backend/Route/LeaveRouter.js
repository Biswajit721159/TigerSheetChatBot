let Router = require("express");

let { getEmployeeCountByDate, getEmployeeNameByDate, getEmployeeCountByYear, getEmployeeNameByYear } = require('../controlter/GetTiggerSheetData')

const router = Router();

router.route('/getEmployeeCountByDate').post(getEmployeeCountByDate)
router.route('/getEmployeeNameByDate').post(getEmployeeNameByDate)
router.route('/getEmployeeCountByYear').post(getEmployeeCountByYear)
router.route('/getEmployeeNameByYear').post(getEmployeeNameByYear)
module.exports = router;