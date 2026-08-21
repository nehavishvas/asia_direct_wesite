import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import SidebarWeb from "../homepage/SidebarwWeb";
import NavbarWeb from "../homepage/NavbarWeb";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import ForumIcon from "@mui/icons-material/Forum";
import "./ChatPage.css";

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'><circle cx='12' cy='8' r='4'/><path d='M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z'/></svg>";

const getProfileImg = (profile) => {
  if (!profile || String(profile).toLowerCase() === "null" || String(profile).toLowerCase() === "undefined" || String(profile).trim() === "") {
    return DEFAULT_AVATAR;
  }
  return `${process.env.REACT_APP_BASE_URL_image}${profile}`;
};

const getUnreadCount = (item) => {
  return Number(item?.unread_count || item?.unreadCount || item?.unread || 0);
};

export default function QuotationInFreight() {
  const loginUser = JSON.parse(localStorage.getItem("data"));

  const [inbox, setInbox] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" or "chat" for mobile view toggle
  const [isSending, setIsSending] = useState(false); // prevent duplicate submissions

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(null);

  // ✅ REF UPDATE
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);
  
  // ================= SOCKET =================
  // useEffect(() => {
  // console.log("🚀 Initializing Socket...");
  // socketRef.current = io(process.env.REACT_APP_BASE_URL);
  // socketRef.current.on("connect", () => {
  //   console.log("✅ SOCKET CONNECTED:", socketRef.current.id);
// jiunn the yexy as pr requ  //   // ✅ JOIN ALL CONVERSATIONS (IMPORTANT)
  //   if (inbox.length > 0) {
  //     inbox.forEach((item) => {
  //       socketRef.current.emit("joinConversation", item.conversation_id);
  //     });
  //   }
  // });

  useEffect(() => {
    console.log("🚀 Initializing Socket...");
    socketRef.current = io(process.env.REACT_APP_BASE_URLSOCKET);
    socketRef.current.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socketRef.current.id);
       if (inbox.length > 0) {
       inbox.forEach((item) => {
         socketRef.current.emit("joinConversation", item.conversation_id);
       });
     }
    });
    socketRef.current.onAny((event, data) => {
      console.log("🔥 EVENT:", event, data);
    });
    socketRef.current.on("disconnect", () => {
      console.log("❌ SOCKET DISCONNECTED");
    });
    // 🔥 RECEIVE MESSAGE
    socketRef.current.on("newMessage", (data) => {
      console.log("📩 SOCKET EVENT: newMessage TRIGGERED");
      console.log("📦 Incoming Data:", data);
      if (data.conversation_id === selectedUserRef.current?.conversation_id) {
        console.log("✅ Message belongs to ACTIVE CHAT");
        
        // Mark as read on the backend live
        const token = localStorage.getItem("token") || loginUser?.token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        axios.post(
          `${process.env.REACT_APP_BASE_URL}markMessagesRead`,
          {
            conversation_id: data.conversation_id,
            current_user_id: loginUser.id,
          },
          { headers }
        ).catch(err => console.log("Error marking live message as read:", err));

        setMessages((prev) => {
          const exists = prev.some((msg) => msg.key === data.message_id);
          if (exists) {
            console.log("⚠️ Duplicate message ignored");
            return prev;
          }
          console.log("✅ Message added to UI");
          return [
            ...prev,
            {
              key: data.message_id || Date.now(),
              sender: data.sender_id === loginUser.id ? "me" : "other",
              text: data.message,
            },
          ];
        });
      } else {
        console.log("⚠️ Message NOT for active chat");
      }
      // 📌 SIDEBAR UPDATE
      console.log("📌 Updating inbox sidebar");
      setInbox((prev) => {
        let updated = prev.map((item) => {
          if (item.conversation_id === data.conversation_id) {
            const isNotActiveChat = selectedUserRef.current?.conversation_id !== data.conversation_id;
            const currentUnread = Number(item.unread_count || item.unreadCount || item.unread || 0);
            return {
              ...item,
              last_message: data.message,
              unread_count: isNotActiveChat ? currentUnread + 1 : 0
            };
          }
          return item;
        });
        const current = updated.find(
          (i) => i.conversation_id === data.conversation_id,
        );
        const rest = updated.filter(
          (i) => i.conversation_id !== data.conversation_id,
        );
        return current ? [current, ...rest] : updated;
      });
    });
    return () => {
      console.log("🧹 Cleaning socket...");
      socketRef.current.disconnect();
    };
  }, []);
  // ================= GET INBOX =================
  useEffect(() => {
    getInbox();
  }, []);
  useEffect(() => {
  if (socketRef.current && inbox.length > 0) {
    console.log("📡 Joining all rooms after inbox load");
    inbox.forEach((item) => {
      socketRef.current.emit("joinConversation", item.conversation_id);
    });
  }
}, [inbox]);
  const getInbox = async () => {
    try {
      console.log("📥 Fetching Inbox...");
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}chat/getInbox`,
        {
          receiver_id: loginUser.id,
          receiver_type: "user",
        },
      );
      if (res.data) {
        console.log("✅ Inbox Loaded:", res.data.inbox);
        setInbox(res.data.inbox || []);
      }
    } catch (error) {
      console.log("❌ Inbox Error:", error);
    }
  };
  // ================= GET MESSAGES =================
  const getMessages = async (conversationId) => {
    try {
      console.log("📥 Fetching Messages for:", conversationId);

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}chat/getMessages`,
        {
          conversation_id: conversationId,
          receiver_id: loginUser.id,
        },
      );
      if (res.data?.messages) {
        console.log("✅ Messages Loaded:", res.data.messages);
        const formatted = res.data.messages.map((msg) => ({
          key: msg.id,
          sender: msg.sender_id === loginUser.id ? "me" : "other",
          text: msg.message,
        }));
        setMessages(formatted);
      }
    } catch (error) {
      console.log("❌ Message Fetch Error:", error);
    }
  };
  // ================= MARK MESSAGES READ =================
  const markChatAsRead = async (conversationId) => {
    try {
      console.log("📖 Marking messages as read for:", conversationId);
      const token = localStorage.getItem("token") || loginUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}markMessagesRead`,
        {
          conversation_id: conversationId,
          current_user_id: loginUser.id,
        },
        { headers }
      );
      
      // Update local inbox state to clear unread count
      setInbox((prev) =>
        prev.map((c) =>
          c.conversation_id === conversationId
            ? { ...c, unread_count: 0, unread: 0, unreadCount: 0 }
            : c
        )
      );
    } catch (error) {
      console.log("❌ Error marking messages as read:", error);
    }
  };

  // ================= SELECT USER =================
  const handleSelectUser = (item) => {
    console.log("👤 USER SELECTED:", item);
    setSelectedUser(item);
    setViewMode("chat");
    if (item?.conversation_id) {
      console.log("🏠 JOINING ROOM:", item.conversation_id);
      socketRef.current.emit("joinConversation", item.conversation_id);
      getMessages(item.conversation_id);
      markChatAsRead(item.conversation_id);
    }
  };
  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!message.trim() || !selectedUser || isSending) {
      return;
    }
    setIsSending(true);
    const textToSend = message;
    setMessage(""); // Clear input instantly to block rapid double-enters/clicks
    
    const payload = {
      sender_id: loginUser.id,
      conversation_id: selectedUser.conversation_id,
      message: textToSend,
    };
    console.log("📤 Sending Message:", payload);
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}chat/sendMessage`,
        payload,
      );
      console.log("✅ Message saved in DB");
    } catch (error) {
      console.log("❌ Send Error:", error);
      setMessage(textToSend); // Restore if failed
    } finally {
      setIsSending(false);
    }
  };
  // ================= AUTO SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const filteredInbox = inbox.filter((item) =>
    String(item.sender_name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavbarWeb />
      <SidebarWeb />
      <section className="manageFrightSec">
        <div className="cp-wrapper">
          <div className="cp-container">
            <div className={`cp-card ${viewMode === "chat" ? "show-chat" : "show-list"}`}>
            
            {/* LEFT SIDE (Sidebar List) */}
            <div className="cp-sidebar">
              {/* Search Inbox bar */}
              <div className="cp-search-area">
                <div className="cp-search-wrapper">
                  <span className="cp-search-icon">
                    <SearchIcon fontSize="small" />
                  </span>
                  <input
                    type="text"
                    className="cp-search-input"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Scrollable List */}
              <div className="cp-inbox-list">
                {filteredInbox.length === 0 ? (
                  <div className="text-center p-4 text-muted" style={{ fontSize: "0.875rem" }}>
                    No candidates found
                  </div>
                ) : (
                  filteredInbox.map((item, index) => {
                    const isActive = selectedUser?.conversation_id === item.conversation_id;
                    return (
                      <div
                        key={item.conversation_id || index}
                        className={`cp-inbox-item ${isActive ? "cp-inbox-item-active" : ""}`}
                        onClick={() => handleSelectUser(item)}
                      >
                        <img
                          src={getProfileImg(item?.sender_profile)}
                          className="cp-avatar"
                          alt="user"
                          onError={(e) => {
                            e.target.src = DEFAULT_AVATAR;
                          }}
                        />

                        <div className="cp-user-info">
                          <div className="cp-username-row">
                            <h6 className="cp-username">{item.sender_name}</h6>
                            {getUnreadCount(item) > 0 && (
                              <span className="cp-unread-badge">
                                {getUnreadCount(item)}
                              </span>
                            )}
                          </div>
                          <p className="cp-last-message">{item.last_message || "No messages yet"}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT SIDE (Chat Window Details) */}
            <div className="cp-chat-window">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="cp-chat-header">
                    <div className="cp-header-user">
                      <button className="cp-back-btn" onClick={() => setViewMode("list")}>
                        <ArrowBackIcon fontSize="small" />
                      </button>
                      <img
                        src={getProfileImg(selectedUser?.sender_profile)}
                        className="cp-header-avatar"
                        alt=""
                        onError={(e) => {
                          e.target.src = DEFAULT_AVATAR;
                        }}
                      />
                      <div className="cp-header-info">
                        <h5 className="cp-header-name">{selectedUser.sender_name}</h5>
                        <div className="cp-status-wrapper">
                          <span className="cp-status-dot"></span>
                          <span className="cp-status-text">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages List Area */}
                  <div className="cp-messages-container">
                    {messages.map((msg) => (
                      <div
                        key={msg.key}
                        className={`cp-message-row ${msg.sender === "me" ? "me" : "other"}`}
                      >
                        <div className="cp-message-bubble">
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                  </div>

                  {/* Compose Input Box */}
                  <div className="cp-compose-area">
                    <div className="cp-compose-input-wrapper">
                      <input
                        className="cp-compose-input"
                        value={message}
                        placeholder={isSending ? "Sending..." : "Type a message..."}
                        disabled={isSending}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      />
                    </div>
                    <button
                      className="cp-send-btn"
                      onClick={sendMessage}
                      disabled={!message.trim() || isSending}
                    >
                      <SendIcon fontSize="small" />
                    </button>
                  </div>
                </>
              ) : (
                /* Empty state placeholder when no chat selected */
                <div className="cp-empty-state">
                  <div className="cp-empty-icon">
                    <ForumIcon fontSize="large" />
                  </div>
                  <h4 className="cp-empty-title">Your Inbox</h4>
                  <p className="cp-empty-subtitle">
                    Select a conversation from the sidebar list to start messaging.
                  </p>
                </div>
              )}
            </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
