var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

export const functiondata = [
    {
        "name": "getEmployeeCountByDate",
        "description": `The function responds to user inquiries about the number of employees or persons who have taken leave on a particular date.Remember the today's date is ${today}`,
        "parameters": {
            "type": "object",
            "properties": {
                "date": {
                    "type": "string",
                    "description": "The date in 'year-month-day' format (e.g., 2024-02-23)"
                }
            },
            "required": [" date in 'year-month-day' format (e.g., 2024-02-23)"]
        }
    },
    {
        "name": "getEmployeeNameByDate",
        "description": `The function triggers a response solely in response to user inquiries about the name of employee or person who have taken leave on a particular date or day. Remember the today's date is ${today}.It processes the user-provided date, return it into the standard format 'year-month-day' (e.g., 2024-02-23)  `,
        "parameters": {
            "type": "object",
            "properties": {
                "date": {
                    "type": "string",
                    "description": "The date in 'year-month-day' format. Example: 2024-02-23"
                }
            },
            "required": [" date in 'year-month-day' format (e.g., 2024-02-23)"]
        }
    },
    {
        "name": "getEmployeeNameByYear",
        "description": `The function triggers a response solely in response to user inquiries about the name of employee or person who have taken leave on a year. Remember we are now in ${yyyy}.It processes the user-provided date, return it into the standard format 'year' (e.g., 2024 ,2023 ,2022)  `,
        "parameters": {
            "type": "object",
            "properties": {
                "year": {
                    "type": "string",
                    "description": "The year in 'year' format. Example: 2024 ,2023"
                }
            },
            "required": [" year in 'year' format (e.g., 2024 , 2023, 2024)"]
        }
    },
    {
        "name": "getEmployeeCountByYear",
        "description": `The function triggers a response solely in response to user inquiries about the count of employee or person who have taken leave on a year. Remember we are now in ${yyyy}.It processes the user-provided date, return it into the standard format 'year' (e.g., 2024 ,2023 ,2022)  `,
        "parameters": {
            "type": "object",
            "properties": {
                "year": {
                    "type": "string",
                    "description": "The year in 'year' format. Example: 2024 ,2023"
                }
            },
            "required": [" year in 'year' format (e.g., 2024 , 2023, 2024)"]
        }
    },
    {
        "name": "getEmployeeNameByTwoDate",
        "description": `The function triggers a response solely in response to user inquiries about the name of employee or person who have taken leave on a particular date Range. Remember the today's date is ${today}.It processes the user-provided date, return those Two date into standard format 'year-month-day' (e.g., 2024-02-23)  `,
        "parameters": {
            "type": "object",
            "properties": {
                "startdate": {
                    "type": "string",
                    "description": "The startdate in 'year' format. format (e.g., 2024-02-23)"
                },
                "lastdate": {
                    "type": "string",
                    "description": "The lastdate in 'year' format. format (e.g., 2024-02-23)"
                }
            },
            "required": ["startdate in 'date' format (e.g., 2024-02-23)", "lastdate in 'date' format (e.g., 2024-02-23)"]
        }
    },
    {
        "name": "getEmployeeCountByTwoDate",
        "description": `The function triggers a response solely in response to user inquiries about the count of employee or person who have taken leave on a particular date Range. Remember the today's date is ${today}.It processes the user-provided date, return those Two date into standard format 'year-month-day' (e.g., 2024-02-23)`,
        "parameters": {
            "type": "object",
            "properties": {
                "startdate": {
                    "type": "string",
                    "description": "The startdate in 'year' format. format (e.g., 2024-02-23)"
                },
                "lastdate": {
                    "type": "string",
                    "description": "The lastdate in 'year' format. format (e.g., 2024-02-23)"
                }
            },
            "required": ["startdate in 'date' format (e.g., 2024-02-23)", "lastdate in 'date' format (e.g., 2024-02-23)"]
        }
    },
];