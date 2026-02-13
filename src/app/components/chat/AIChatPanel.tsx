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
    Fade,
    Avatar,
    CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

export default function AIChatPanel({ tableData }: { tableData: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const { messages, sendMessage, status } = useChat({
        id: "ai-analytics-chat",
    });

    const isLoading = status === "streaming" || status === "submitted";

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const currentInput = input;
        setInput("");

        await sendMessage(
            { text: currentInput },
            {
                body: { tableData },
            }
        );
    };

    return (
        <>
            {!isOpen && (
                <Fade in={!isOpen}>
                    <Fab
                        color="primary"
                        sx={{
                            position: "fixed",
                            bottom: 24,
                            right: 24,
                            bgcolor: "#7c3aed",
                            '&:hover': { bgcolor: "#6d28d9" }
                        }}
                        onClick={() => setIsOpen(true)}
                    >
                        <ChatIcon />
                    </Fab>
                </Fade>
            )}

            <Fade in={isOpen}>
                <Paper
                    elevation={6}
                    sx={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        width: { xs: "calc(100% - 48px)", sm: 380 },
                        height: 550,
                        maxHeight: "80vh",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "20px",
                        overflow: "hidden",
                        zIndex: 1000,
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Typography variant="subtitle1" fontWeight="700" lineHeight={1.2}>
                                AI Assistant
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => setIsOpen(false)}
                            sx={{ color: "white", '&:hover': { bgcolor: "rgba(255,255,255,0.1)" } }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <Box
                        ref={scrollRef}
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            p: 2,
                            bgcolor: "#fcfcfe",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        {messages.length === 0 && (
                            <Box sx={{ textAlign: "center", mt: 4, px: 4, opacity: 0.6 }}>
                                <Typography variant="body2">
                                    Ask me anything about your data! Try "Summarize the current table."
                                </Typography>
                            </Box>
                        )}

                        {messages.map((m) => {
                            const isUser = m.role === "user";
                            const textContent = m.parts
                                ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                                .map((p) => p.text)
                                .join("");

                            return (
                                <Box
                                    key={m.id}
                                    sx={{
                                        display: "flex",
                                        justifyContent: isUser ? "flex-end" : "flex-start",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            px: 2,
                                            borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                                            bgcolor: isUser ? "#7c3aed" : "white",
                                            color: isUser ? "white" : "#334155",
                                            maxWidth: "85%",
                                            boxShadow: isUser ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
                                            border: isUser ? "none" : "1px solid #f1f5f9",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                                            {textContent}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}

                        {isLoading && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
                                <CircularProgress size={12} sx={{ color: "#8b5cf6" }} />
                                <Typography variant="caption" color="textSecondary">
                                    Analyzing data...
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            p: 2,
                            bgcolor: "white",
                            borderTop: "1px solid #f1f5f9",
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            autoComplete="off"
                            disabled={isLoading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    bgcolor: '#f8fafc',
                                    '& fieldset': { borderColor: 'transparent' },
                                    '&:hover fieldset': { borderColor: '#e2e8f0' },
                                    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                }
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <IconButton
                                            type="submit"
                                            disabled={isLoading || !input.trim()}
                                            sx={{
                                                color: "#7c3aed",
                                                '&.Mui-disabled': { color: "#cbd5e1" }
                                            }}
                                        >
                                            <SendIcon fontSize="small" />
                                        </IconButton>
                                    ),
                                },
                            }}
                        />
                    </Box>
                </Paper>
            </Fade>
        </>
    );
}