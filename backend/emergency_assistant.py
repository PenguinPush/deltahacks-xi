import cohere
import os
import json
from dotenv import load_dotenv
from typing import Dict, List

load_dotenv()


class EmergencyAssistant:
    def __init__(self):
        self.co = cohere.Client(os.getenv('COHERE_API_KEY'))
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

        # Updated tools configuration for v2
        self.web_search_tool = [
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

    def web_search(self, queries: list[str]) -> list[Dict]:
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
        try:
            print("Sending request to Cohere...")  # Debug output
            response = self.co.chat(
                model='command-r-plus-08-2024',
                message=user_message,
                preamble=self.system_prompt,
                temperature=0.7,
                search_queries_only=False,
                connectors=[{"id": "web-search"}],
            )
            print("Response received!")  # Debug output
            return {
                "response": response.text
            }
        except Exception as e:
            print(f"Error occurred: {str(e)}")  # Debug output
            return {
                "response": f"An error occurred: {str(e)}"
            }
