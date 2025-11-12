import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageFunctionCall,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai'
import { ILanguageModel } from './LanguageModels/ILanguageModel'
import { AiFunction } from './AiFunctions'

class Conversation {
  private llm: ILanguageModel
  private user: string
  private messages: (
    | ChatCompletionRequestMessage
    | ChatCompletionRequestMessageFunctionCall
  )[]
  private functions: AiFunction[]
  constructor(
    llm: ILanguageModel,
    user: string,
    prompt: string,
    functions: AiFunction[],
  ) {
    this.llm = llm
    this.user = user
    this.messages = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: prompt,
      },
    ]
    this.functions = functions
  }

  addMessage(message: string, role: ChatCompletionRequestMessageRoleEnum) {
    this.messages.push({
      role,
      content: message,
    })
  }

  addFunctionRequest(func_call: { name: string; args: string }) {
    this.messages.push({
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: null,
      function_call: {
        name: func_call.name,
        arguments: func_call.args,
      },
    } as ChatCompletionRequestMessageFunctionCall)
  }

  addFunctionResponse(func_name: string, result: string) {
    this.messages.push({
      role: ChatCompletionRequestMessageRoleEnum.Function,
      name: func_name,
      content: result,
    })
  }

  async generateResponse() {
    return this.llm.generateText(
      this.messages,
      this.user,
      0,
      this.functions.map((x) => x.description),
    )
  }

  setFunctions(functions: AiFunction[]) {
    this.functions = functions
  }

  changeLLM(newLLM: ILanguageModel) {
    this.llm = newLLM
  }

  getMessages() {
    return this.messages
  }
}

export default Conversation
