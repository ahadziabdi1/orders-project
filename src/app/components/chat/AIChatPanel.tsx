"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Fab,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

export default function AIChatPanel({ tableData }: { tableData: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState(""); // ✅ YOU manage input now
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: "ai-analytics-chat",
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(
      { text: input },
      {
        body: {
          tableData, // ✅ sent correctly
        },
      }
    );

    setInput(""); // clear input
  };

  if (!isOpen) {
    return (
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24, bgcolor: "#8b5cf6" }}
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon />
      </Fab>
    );
  }

  return (
    <Paper
      elevation={12}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 380,
        height: 500,
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        overflow: "hidden",
        zIndex: 1000,
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#8b5cf6",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" fontWeight="600">
          📊 AI Analitika
        </Typography>
        <IconButton
          size="small"
          onClick={() => setIsOpen(false)}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: "auto", p: 2, bgcolor: "#f8fafc" }}>
  {messages.map((m) => (
    <Box
      key={m.id}
      sx={{
        display: "flex",
        justifyContent: m.role === "user" ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: m.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
          bgcolor: m.role === "user" ? "#8b5cf6" : "white",
          color: m.role === "user" ? "white" : "#1e293b",
          maxWidth: "85%",
        }}
      >
        <Typography variant="body2">
          {m.parts
            ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
            .map((p) => p.text)
            .join('')}
        </Typography>
      </Box>
    </Box>
  ))}
</Box>



      {/* Input */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          bgcolor: "white",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Unesi pitanje..."
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <IconButton
                type="submit"
                disabled={isLoading || !input.trim()}
                sx={{ color: "#8b5cf6" }}
              >
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Paper>
  );
}
