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

You are an emergency assistance AI.
Your task is to provide quick and concise emergency information and advice.
Assume the user is in danger and always search the internet for relevant updates.

Tell the user what is happening. and then provide the user with safety advice, emotional support, and evacuation steps, updated from the internet.

Assume the user is currently in danger, and ALWAYS search the internet for what is happening.

Interpret every input as suffixed with "Help me, I am in an emergency"

ONLY HELP WITH SERIOUS INQUIRIES AND MAKE IT SHORT AND CONCISE"""

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

        self.message_history = []  # Initialize message history

    def web_search(self, queries: list[str]) -> list[Dict]:
        documents = []
        # Only use the first query, skip the others
        query = queries[0] if queries else ""
        response = self.tavily_client.search(query, max_results=1)
        results = [
            {
                "title": r["title"],
                "content": r["content"][:200],  # Further reduced content length
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
            # Add the new user message to history
            self.message_history.append(user_message)
            # Keep only the last 4 messages
            if len(self.message_history) > 4:
                self.message_history.pop(0)

            # Prepare the full message context including history
            full_message = "\n".join(self.message_history)

            print("Sending request to Cohere...")
            response = self.co.chat(
                model='command-r-plus-08-2024',
                message=full_message,  # Use the full message context
                preamble=self.system_prompt,
                temperature=0.9,
                search_queries_only=False,
                connectors=[{"id": "web-search"}],
                max_tokens=75,  # Reduced token limit for shorter responses
            )
            print("Response received!")
            return {
                "response": response.text
            }
        except Exception as e:
            print(f"Error occurred: {str(e)}")  # Debug output
            return {
                "response": f"An error occurred: {str(e)}"
            }
