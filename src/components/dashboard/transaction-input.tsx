"use client";

import { useState, useRef, useEffect } from "react";
import {
  useCreateTransaction,
  useAiParse,
} from "@/hooks/use-transactions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, X, Edit2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { CreateTransactionDto } from "@/types/api";

// Define the chat message types
interface ChatMessage {
  id: number;
  type: "user" | "system";
  content: string | { typing: boolean } | { error: string } | { transaction: CreateTransactionDto & { id?: number } };
  status?: "pending" | "saved" | "error"; // only for system messages with transaction
}

export default function TransactionInput() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutate: createTransaction } = useCreateTransaction();
  const { mutate: aiParse } = useAiParse();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: Date.now() + 1,
      type: "system",
      content: { typing: true },
    };
    setMessages((prev) => [...prev, typingMessage]);

    // Parse the input with AI
    aiParse(
      { text: userMessage.content as string },
      {
        onSuccess: (data: CreateTransactionDto[]) => {
          // Remove typing message
          setMessages((prev) => prev.filter(msg => !(typeof msg.content === 'object' && 'typing' in msg.content)));

          if (data.length === 0) {
             const errorMessage: ChatMessage = {
              id: Date.now() + 2,
              type: "system",
              content: { error: "Maaf, format transaksi tidak dikenali. Coba ketik seperti: 'jual kopi 2 40000'" },
            };
            setMessages((prev) => [...prev, errorMessage]);
            setIsProcessing(false);
            return;
          }

          // Add system messages for each transaction
          data.forEach((transaction, index) => {
            const systemMessage: ChatMessage = {
              id: Date.now() + index + 2,
              type: "system",
              content: { transaction },
            };
            setMessages((prev) => [...prev, systemMessage]);
          });
          
          setIsProcessing(false);
        },
        onError: (error) => {
          // Remove typing message and show error
          setMessages((prev) => prev.filter(msg => !(typeof msg.content === 'object' && 'typing' in msg.content)));
          const errorMessage: ChatMessage = {
            id: Date.now() + 2,
            type: "system",
            content: {
              error: error.response?.data?.message || "Gagal memproses teks",
            },
            status: "error",
          };
          setMessages((prev) => [...prev, errorMessage]);
          setIsProcessing(false);
        },
      }
    );
  };

  const handleSaveTransaction = async (
    messageId: number,
    transaction: CreateTransactionDto
  ) => {
    // Update message status to saving
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, status: "pending" }
          : msg
      )
    );

    // Save the transaction
    createTransaction(
      transaction,
      {
        onSuccess: () => {
          // Update message status to saved
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, status: "saved" }
                : msg
            )
          );
        },
        onError: (error) => {
          // Update message status to error
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, status: "error" }
                : msg
            )
          );
          toast.error(
            error.response?.data?.message || "Gagal menyimpan transaksi"
          );
        },
      }
    );
  };

  const handleRemoveTransaction = (messageId: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  // Format amount as IDR
  const formatIDR = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="h-[600px] flex flex-col shadow-md border-gray-200">
      <CardHeader className="py-3 border-b bg-green-50/50">
        <CardTitle className="text-lg font-medium flex items-center text-green-800">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          Pencatatan Cepat
        </CardTitle>
      </CardHeader>
      
      {/* Chat Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/chat-bg.png')] bg-opacity-5">
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-2">
            <div className="p-4 bg-gray-50 rounded-full mb-2">
              <Send className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-sm">Mulai mencatat seperti chatting</p>
            <div className="text-xs space-y-1 mt-4">
              <p className="font-medium text-gray-500">Contoh ketik:</p>
              <p className="bg-gray-100 px-3 py-1 rounded-md inline-block">jual kopi 2 40000</p>
              <p className="bg-gray-100 px-3 py-1 rounded-md inline-block mt-1">beli gula 1 20000</p>
            </div>
          </div>
        )}

        {messages.map((message) => {
          if (message.type === "user") {
            return (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[85%] p-3 bg-[#dcf8c6] text-gray-800 rounded-lg rounded-tr-none shadow-sm text-sm">
                  {message.content as string}
                </div>
              </div>
            );
          }

          if (message.type === "system") {
            const content = message.content as any;
            
            if (content.typing) {
              return (
                <div key={message.id} className="flex justify-start">
                  <div className="p-3 bg-white border border-gray-100 rounded-lg rounded-tl-none shadow-sm flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              );
            }

            if (content.error) {
              return (
                <div key={message.id} className="flex justify-start">
                  <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg rounded-tl-none shadow-sm text-sm max-w-[85%]">
                    {content.error}
                  </div>
                </div>
              );
            }

            if (content.transaction) {
              const transaction = content.transaction as CreateTransactionDto;
              const formattedAmount = formatIDR(transaction.amount);
              const totalAmount = transaction.qty * transaction.amount;
              const formattedTotal = formatIDR(totalAmount);

              return (
                <div key={message.id} className="flex justify-start">
                  <div className={`p-3 max-w-[85%] bg-white border ${
                      message.status === "saved"
                        ? "border-green-200"
                        : "border-gray-200"
                    } rounded-lg rounded-tl-none shadow-sm text-sm`}
                  >
                    <div className="flex items-start space-x-3 mb-2">
                      <div className={`mt-0.5 p-1 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                        {transaction.type === "income" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{transaction.itemName}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {transaction.qty} x {formattedAmount}
                        </p>
                        <p className={`font-semibold mt-1 ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "income" ? "+ " : "- "}
                          {formattedTotal}
                        </p>
                      </div>
                    </div>
                    
                    {message.status !== "saved" ? (
                      <div className="flex space-x-2 mt-3 pt-2 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                          onClick={() => handleSaveTransaction(message.id, transaction)}
                          disabled={message.status === "pending"}
                        >
                          {message.status === "pending" ? (
                            <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Menyimpan</>
                          ) : (
                            "Simpan"
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleRemoveTransaction(message.id)}
                          disabled={message.status === "pending"}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-green-600 flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Berhasil dicatat
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          }

          return null;
        })}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input Area */}
      <div className="p-3 border-t bg-gray-50/50">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik: jual kopi 2 40000"
            className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            disabled={isProcessing}
            autoComplete="off"
          />
          <Button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="rounded-full w-10 h-10 p-0 bg-green-600 hover:bg-green-700 shrink-0 shadow-sm"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4 ml-0.5" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}