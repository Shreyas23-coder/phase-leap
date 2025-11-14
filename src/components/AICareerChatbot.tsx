import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Send, Zap, Sparkles, Award, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AICareerChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm your AI job assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<string>('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = async (action: string, prompt: string) => {
    setCurrentAction(action);
    await sendMessage(prompt, action);
  };

  const sendMessage = async (messageText?: string, action?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('career-chatbot', {
        body: {
          message: textToSend,
          conversationId: conversationId,
          action: action || currentAction
        }
      });

      if (error) throw error;

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message
        }]);
        
        if (!conversationId && data.conversationId) {
          setConversationId(data.conversationId);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <Card className="w-full h-full flex flex-col bg-gradient-card backdrop-blur-xl border border-border/50 rounded-2xl shadow-large">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          AI Career Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="p-6 pt-0 space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all rounded-xl"
              onClick={() => handleQuickAction('resume-analysis', 'I need help analyzing my resume')}
            >
              <Zap className="mr-2 h-4 w-4" />
              Resume Analysis
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all rounded-xl"
              onClick={() => handleQuickAction('job-recommendations', 'I want job recommendations based on my profile')}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Job Recommendations
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all rounded-xl"
              onClick={() => handleQuickAction('interview-prep', 'Help me prepare for an interview')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Interview Prep
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all rounded-xl"
              onClick={() => handleQuickAction('career-advice', 'I need career advice')}
            >
              <Award className="mr-2 h-4 w-4" />
              Career Advice
            </Button>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-6 pt-0">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-primary hover:shadow-glow transition-all"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
