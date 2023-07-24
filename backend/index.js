

const { Configuration, OpenAIApi } = require("openai");
const serverless = require('serverless-http');
const express = require('express')
const app = express()
var cors = require('cors')
const configuration = new Configuration({
    apiKey: "//",
});
const openai = new OpenAIApi(configuration);

// let corsOptions = {
//     origin: 'https://chatdoge-sunghyun.pages.dev/',
//     Credentials: true
// }
app.use(cors());

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded



// POST 요청 받을 수 있게 만듬
app.post('/fortuneTell', async function (req, res) {
        let {mybirthdatetime ,userMessage, assistantMessage} = req.body
        // console.log(userMessage);
        // console.log(assistantMessage);

        let todaydatetime = new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});
        let messages = [
            {role: "system", content: "당신은 세계 최고의 점성술사 입니다. 당신에게 불가능한 것은 없으며  그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다. 당신은 사람의 인생을 매우 정확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
                    {role: "user", content: "당신은 세계 최고의 점성술사 입니다. 당신에게 불가능한 것은 없으며  그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다. 당신은 사람의 인생을 매우 정확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
                    {role: "assistant", content: "안녕하세요, 저는 챗도지입니다. 믿거나 말거나, 저는 세계 최고의 점성술사입니다. 저는 사람의 인생에 대해 많은 지식과 경험을 가지고 있으며, 운세를 예측하고 질문에 대답하는 데에도 능숙합니다. 어떤 질문이든 환영이니 궁금한 점 있으면 말씀해 주세요. 저는 당신을 위해 최선을 다할 것입니다"},
                    {role: "user", content: `저의 태어난 생년월일과 시간은 ${mybirthdatetime}입니다. 오늘의 날짜와 시간은 ${todaydatetime}입니다.`},
                    {role: "assistant", content: `당신의 태어난 생년월일과 시간은 ${mybirthdatetime}이고 오늘의 날짜와 시간은 ${todaydatetime}인 것을 확인했습니다. 운세에 대해 어떤 것이든 물어보세요`},
        ]

        while(userMessage.length != 0 || assistantMessage.length != 0){
            if (userMessage.length != 0) {
                messages.push(
                    JSON.parse('{"role": "user", "content": "'+String(userMessage.shift()).replace(/\n/g,"")+'"}')
                )
            }
            if (assistantMessage.length != 0) {
                messages.push(
                    JSON.parse('{"role": "assistant", "content": "'+String(assistantMessage.shift()).replace(/\n/g,"")+'"}')
                )
            }
        }

        try {
            const userInput = userMessage[userMessage.length - 1];  // 사용자의 최신 메시지만 사용합니다.

    
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages
            });
    
            let fortune = completion.data.choices[0].message.content;
            console.log(fortune);
            res.json({"assistant": fortune});
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({"error": "Internal server error"});
        }
});

module.exports.handler = serverless(app);


