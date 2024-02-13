import { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import Chat from './Chat';
import { get_answer } from '../BackendConnection/CallChatGpt'
import { PulseLoader } from 'react-spinners'

const ChatBot = () => {

  const [loader, setLoader] = useState(false)

  let [message, setMessage] = useState([
    {
      "role": 'assistant',
      "content": "How can I help you today?",
      'time': todayDate()
    }
  ])

  const [input, setinput] = useState('')

  function todayDate() {
    const currentDate = new Date();
    // const year = currentDate.getFullYear();
    // const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const seconds = ('0' + currentDate.getSeconds()).slice(-2);
    const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const currentDateTime = `${day} ${monthNames[currentDate.getMonth()]} ${hours}:${minutes}:${seconds}`;
    return currentDateTime
  }

  async function submit() {
    setLoader(true)
    let newMessage = {
      "role": "user",
      "content": input,
      'time': todayDate()
    }
    message.push(newMessage)
    setMessage([...message])

    setinput('')
    let data = await get_answer(input)
    newMessage = {
      "role": "assistant",
      "content": data,
      'time': todayDate()
    }
    message.push(newMessage)
    setMessage([...message])
    setLoader(false)
  }

  const handelEnter = async (e) => {
    if(loader==true){
      return
    }
    if (e.key === 'Enter') {
      submit()
    }
  }

  const msgEnd = useRef(null)
  useEffect(() => {
    msgEnd.current.scrollIntoView()
  }, [message])


  return (
    <div className="card card-primary direct-chat direct-chat-info" style={{ height: '97vh' }}>
      <div className="card-header">
        <ChatHeader length={message.length} />
      </div>
      <div className="card-body" >
        <div className="direct-chat-messages" style={{ height: '100%' }}>
          <Chat message={message} />
          {loader === true && <PulseLoader color="#181C1C" size={'8px'} />}
          <div ref={msgEnd} />
        </div>
      </div>
      <div className="card-footer">
        <div className="input-group">
          <input type="text" name="message" onChange={(e) => setinput(e.target.value)} value={input} onKeyDown={handelEnter} placeholder="Type Message ..." className="form-control" />
          <span className="input-group-append">
            <button type="button" onClick={submit} disabled={loader} className="btn btn-primary">Send</button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
