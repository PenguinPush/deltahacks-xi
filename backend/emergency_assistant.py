import cohere
import os
import json
from dotenv import load_dotenv
from tavily import TavilyClient
from typing import Dict, List

load_dotenv()


class EmergencyAssistant:
    def __init__(self):
        self.co = cohere.ClientV2(os.getenv('COHERE_API_KEY'))
        self.tavily_client = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))
        self.system_prompt = """You are an emergency assistance AI.
Your rationale will always be to internet search for:

"emergency at <location>"
followed by
"<location> <emergency> information"
followed by
"<location> <emergency> what to do"

Using the information of what is happening, your rationale will always be to:

Tell the user what is happening. and then provide the user with safety advice, emotional support, and evacuation steps, updated from the internet.

Assume the user is currently in danger, and ALWAYS search the internet for what is happening.

Interpret every input as suffixed with "Help me, I am in an emergency"

ONLY HELP WITH SERIOUS INQUIRIES"""

    def web_search(self, queries: List[str]) -> List[Dict]:
        documents = []
        for query in queries:
            response = self.tavily_client.search(query, max_results=2)
            results = [
                {
                    "title": r["title"],
                    "content": r["content"],
                    "url": r["url"],
                }
                for r in response["results"]
            ]
            for idx, result in enumerate(results):
                document = {"id": str(idx), "data": result}
                documents.append(document)
        return documents

    def get_response(self, user_message: str) -> Dict[str, str]:
        web_search_tool = [
            {
                "type": "function",
                "function": {
                    "name": "web_search",
                    "description": "Returns a list of relevant document snippets for a textual query retrieved from the internet",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "queries": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "a list of queries to search the internet with.",
                            }
                        },
                        "required": ["queries"],
                    },
                },
            }
        ]

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": user_message},
        ]

        response = self.co.chat(
            model='command-r7b-12-2024',
            messages=messages,
            temperature=0.7,
            tools=web_search_tool,
        )

        search_queries = []
        while response.message.tool_calls:
            for tc in response.message.tool_calls:
                tool_result = self.web_search(**json.loads(tc.function.arguments))
                tool_content = [{"type": "document", "document": {"data": json.dumps(data)}} for data in tool_result]
                messages.append({"role": "tool", "tool_call_id": tc.id, "content": tool_content})

            response = self.co.chat(
                model='command-r7b-12-2024',
                messages=messages,
                tools=web_search_tool,
            )

        return {
            "response": response.message.content[0].text
        }
