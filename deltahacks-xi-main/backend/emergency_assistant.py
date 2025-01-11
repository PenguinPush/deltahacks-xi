import cohere
from typing import Dict
import os
from dotenv import load_dotenv

load_dotenv()

class EmergencyAssistant:
    def __init__(self):
        # Initialize Cohere client (you'll need to set your API key in environment variables)
        self.co = cohere.Client(os.getenv('COHERE_API_KEY'))
        
        # Define the initial system prompt
        self.system_prompt = """You are an emergency assistance AI. Your role is to:
1. Remain calm and professional
2. Assess emergency situations quickly
3. Provide clear, actionable instructions
4. Help coordinate with emergency services
5. Offer immediate safety guidance

Always prioritize user safety and direct them to call emergency services (911) for life-threatening situations."""

    def get_response(self, user_message: str) -> Dict[str, str]:
        """
        Generate a response using Cohere's chat model
        """
        response = self.co.chat(
            message=user_message,
            preamble=self.system_prompt,
            temperature=0.7,
            connectors=[{"id": "web-search"}]  # Optional: Enable web search for up-to-date information
        )
        
        return {
            "response": response.text,
            "emergency_level": self._assess_emergency_level(user_message)
        }
    
    def _assess_emergency_level(self, message: str) -> str:
        """
        Assess the emergency level based on keywords and context
        Returns: 'critical', 'urgent', or 'normal'
        """
        critical_keywords = ['heart attack', 'stroke', 'bleeding', 'unconscious', 'not breathing']
        urgent_keywords = ['broken', 'injury', 'pain', 'accident']
        
        message = message.lower()
        
        if any(keyword in message for keyword in critical_keywords):
            return 'critical'
        elif any(keyword in message for keyword in urgent_keywords):
            return 'urgent'
        return 'normal' 