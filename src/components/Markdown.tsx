import React from 'react'
import ReactMarkdown from 'react-markdown'

const MarkdownPage = ({ text }: { text: string }) => {
  return <ReactMarkdown>{text}</ReactMarkdown>
}

export default MarkdownPage
