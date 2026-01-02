<a align="center" href="https://ping-ruby-eight.vercel.app/" target="_blank" >
  <img src="https://ping-ruby-eight.vercel.app/assets/appImage.png" width="100%" alt="Ping" />
</a>

# 💬 Ping - Connect & Chat Instantly

**Ping** is a modern, real-time messaging application built with **Next.js**, allowing users to **connect with friends, collaborate with teams, and stay in touch instantly**.
It is designed for speed, security, and a seamless user experience across devices.

Live Website: **https://ping-ruby-eight.vercel.app**

---

## 🚀 Features

### ⚡ Lightning Fast Messaging

- **Real-time Communication**: Instant message delivery using Socket.io.
- **Live Updates**: Chat list updates in real-time when new messages arrive.
- **Instant Read Receipts**: See when your messages are read immediately.

### 🔒 Secure & Private

- **Authentication**: Secure JWT-based authentication with HttpOnly cookies.
- **Private Conversations**: One-on-one messaging with user privacy in mind.
- **Presence System**: Real-time online status and last active indicators.

### 🤝 Seamless Experience

- **Responsive UI**: Built with ShadCN UI and TailwindCSS for a beautiful mobile and desktop experience.
- **Global Search**: Easily find and connect with other users on the platform.
- **Rich Media**: Support for text and emoji messaging (Media sharing coming soon).

---

## 🏗️ Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Framework  | Next.js 15 (App Router)                     |
| Language   | TypeScript                                  |
| Styling    | TailwindCSS + ShadCN UI                     |
| Database   | MongoDB (Mongoose)                          |
| Real-time  | Socket.io (Custom Server)                   |
| Deployment | Vercel (Frontend) / Railway (Socket Server) |
| State      | React State + Context                       |

---

## 📐 Architecture Overview

                      ┌─────────────────────────────┐
                      │           Web App           │
                      │   (Next.js + API Routes)    │
                      └───────────────┬─────────────┘
                                      │
                                      │ REST API / Sockets
                                      │
                           ┌──────────┴──────────┐
                           │     MongoDB DB      │
                           └──────────┬──────────┘
                                      │
                                      │
                   ┌──────────────────┴──────────────────┐
                   │           Socket Server             │
                   │    Real-time Events & Broadcasts    │
                   └─────────────────────────────────────┘

---

## 💡 Key Functionalities

1. **User Authentication**: Secure Signup/Login flow.
2. **Dashboard**: Central hub for all your conversations.
3. **Chat Interface**:
   - Auto-scrolling chat window.
   - Dynamic message bubbles.
   - Unread message counters.
   - Active user polling.

---

### 📄 License

Licensed under MIT License.

### ⭐ Support

If this project helps you, please give it a star ⭐ on GitHub!

## 🤝Connect me on:

[![email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:sahillokhande94@gmail.com) [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/sahillokhande26) [![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/sahil_lokhande26) [![X](https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white)](https://x.com/sahillokhande26)
