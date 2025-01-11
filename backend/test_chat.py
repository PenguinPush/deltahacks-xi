from emergency_assistant import EmergencyAssistant
import os
from dotenv import load_dotenv

load_dotenv()


def main():
    assistant = EmergencyAssistant()
    print("Emergency Assistant Chat (type 'quit' to exit)")
    print("--------------------------------------------")

    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == 'quit':
            break

        response = assistant.get_response(user_input)
        print(f"\nAssistant: {response['response']}")
        print(f"Emergency Level: {response['emergency_level']}")


if __name__ == "__main__":
    main()
