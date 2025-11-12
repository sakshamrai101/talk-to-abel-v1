export type AiFunction = {
  description: { name: string; description: string; parameters: any }
  function: (arg: string) => any
}

export const ai_functions = []
/*export const ai_functions : AiFunction[] = [
    {
        description: {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                      "type": "string",
                      "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
          },
        function: (arg: string) => {
            console.log('get_current_weather args', arg)
            const argAsObject = JSON.parse(arg)
            if ('location' in argAsObject && argAsObject.location) {
                const loc: string = argAsObject.location
                if (loc.includes('Boston')) return '90'
                else if (loc.includes('London')) return '80'
                else if (loc.includes('San Diego')) return '70'
                else return '60'
            }
            return 'Error'
        }
    }
]*/

export const lang_functions: AiFunction[] = [
  {
    description: {
      name: 'switch_language',
      description: 'Switch the language of the conversation',
      parameters: {
        type: 'object',
        properties: {
          languageCode: {
            type: 'string',
            description: 'The language the code the user is switching to.',
          },
        },
        required: ['languageCode'],
      },
    },
    function: (arg: string) => {
      console.log('switch_language', arg)
      const argAsObject = JSON.parse(arg)
    },
  },
]
