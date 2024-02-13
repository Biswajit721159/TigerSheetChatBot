import OpenAI from "openai";
import { getEmployeeCountByDate, getEmployeeNameByDate, getEmployeeCountByYear, getEmployeeNameByYear } from '../BackendConnection/DataBaseConnection'

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_ChatGptApiKey,
    dangerouslyAllowBrowser: true
});

let conversationHistory = [];

export async function get_answer(question) {

    conversationHistory.push({
        'role': 'user',
        'content': question
    })

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    try {
        // let messages = [{ 'role': 'user', 'content': question }];

        const functions = [
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
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0613",
            messages: conversationHistory,
            functions: functions,
            function_call: "auto"
        });

        const responseMessage = response.choices[0].message;
        // console.log("first responce is ", responseMessage);

        if (responseMessage.function_call) {
            const availableFunctions = {
                "getEmployeeCountByDate": getEmployeeCountByDate,
                'getEmployeeNameByDate': getEmployeeNameByDate,
                "getEmployeeCountByYear": getEmployeeCountByYear,
                "getEmployeeNameByYear": getEmployeeNameByYear,
            };
            const functionName = responseMessage.function_call.name;
            const functionToCall = availableFunctions[functionName];
            const functionArgs = JSON.parse(responseMessage.function_call.arguments);
            const functionResponse = await functionToCall(functionArgs);

            // console.log("responce coming from tiggersheet backend  ", functionResponse)

            conversationHistory.push({
                'role': 'assistant',
                'content': functionResponse
            })

            return functionResponse;

            // messages.push(responseMessage);
            // messages.push({
            //     "role": "function",
            //     "name": functionName,
            //     "content": String(functionResponse)
            // });

            // console.log("messages is ",messages)

            // const secondResponse = await openai.chat.completions.create({
            //     model: "gpt-3.5-turbo-0613",
            //     messages: messages
            // });

            // console.log("second responce is ",secondResponse.choices[0].message.content)
            // return secondResponse.choices[0].message.content;
        } else {
            console.log("not other function called ", responseMessage.content)
            return responseMessage.content;
        }
    } catch {
        return "We are unable to process your question currently."
    }
}

