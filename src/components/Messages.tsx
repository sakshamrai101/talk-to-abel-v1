export const Messages = ({
  promptOneLiner,
  messages,
  warning,
  messagesEndRef,
}: {
  promptOneLiner: string
  messages: string[]
  warning: string | null
  messagesEndRef: any
}) => {
  return (
    <div className="messages">
      <div className="message" key={Math.random()}>
        <b>{promptOneLiner}</b>
        <br />
        Click or tap my head to talk, or use the buttons above to change my
        settings.
        <br />
        <br />
        <i className="warning">
          <span className="material-symbols-outlined">warning</span> {warning}
        </i>
      </div>
      {messages.map((message) => (
        <>
          {message.startsWith('user:') && (
            <div className="message userMessage" key={message + Math.random()}>
              {message.replace('user:', '')}
            </div>
          )}
          {!message.startsWith('user:') && (
            <div className="message" key={message + Math.random()}>
              {message}
            </div>
          )}
        </>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
