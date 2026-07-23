import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";

export default function ChatPage() {
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
            }}
        >
            <ChatList />

            <ChatWindow />
        </div>
    );
}