import { useEffect, useRef, useState } from "react"

function App() {
  const [message, setMessage] = useState(["hello"]);
  const wsRef = useRef();

  const sendMessage = ()=>{
    const message = document.getElementById("message")?.value;
    wsRef.current.send(JSON.stringify({
      type:"chat",
      payload:{
        message:message
      }
    }))
  }

  useEffect(()=>{
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (e) => {
      setMessage(m=>[...m, e.data])
    }
    wsRef.current=ws;

    ws.onopen = ()=>{
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId:"red"
        }
      }))
    }
  },[])

  return (
    <div className="bg-black h-screen font-semibold text-white overflow-hidden">
      <br />
      <div className="h-[85%]">
        {message.map((message)=>(
          <div className="m-8">
            <span className="bg-zinc-800 rounded p-4">{message}</span>
          </div>
        ))}
      </div>
      <div className="bg-zinc-600 flex">
        <input id="message" className=" flex-1 p-4 bg-zinc-900 outline-none" placeholder="Type messages here..." type="text" />
        <button onClick={sendMessage} className="bg-zinc-800 p-4">Send</button>
      </div>
    </div>
  )
}

export default App
