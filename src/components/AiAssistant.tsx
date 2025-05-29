'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/db';
import { Aircraft } from '@/types/aircraft';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your fleet management assistant. I can help you locate aircraft, check status, and provide fleet metrics. How can I help?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Process the query and get response
    const response = await getAIResponse(input);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const findAircraft = (query: string): Aircraft[] => {
    const allAircraft = db.getAll();
    const normalizedQuery = query.toLowerCase();
    
    return allAircraft.filter(aircraft => 
      aircraft.tailNumber.toLowerCase().includes(normalizedQuery) ||
      aircraft.model.toLowerCase().includes(normalizedQuery) ||
      aircraft.status.toLowerCase().includes(normalizedQuery)
    );
  };

  const getFleetSummary = (): string => {
    const metrics = db.getFleetMetrics();
    return `Current fleet status:\n` +
           `• Total aircraft: ${metrics.total}\n` +
           `• Available: ${metrics.available} (${metrics.availabilityRate.toFixed(1)}%)\n` +
           `• In maintenance: ${metrics.maintenance} (${metrics.maintenanceRate.toFixed(1)}%)\n` +
           `• AOG: ${metrics.aog} (${metrics.aogRate.toFixed(1)}%)`;
  };

  const getRecentChanges = (): string => {
    const changes = db.getRecentStatusChanges(3);
    if (changes.length === 0) return "No recent status changes.";
    
    return "Recent status changes:\n" + changes.map(change => 
      `• ${change.tailNumber}: ${change.previousStatus} → ${change.newStatus} (${new Date(change.timestamp).toLocaleTimeString()})`
    ).join("\n");
  };

  const getAIResponse = async (query: string): Promise<string> => {
    const normalizedQuery = query.toLowerCase();

    // Handle location queries
    if (normalizedQuery.includes('where') || normalizedQuery.includes('locate') || normalizedQuery.includes('find')) {
      const searchTerms = normalizedQuery.split(' ').filter(term => 
        !['where', 'is', 'the', 'locate', 'find', 'me', 'show', 'aircraft', 'plane'].includes(term)
      );
      
      const foundAircraft = findAircraft(searchTerms.join(' '));
      
      if (foundAircraft.length === 0) {
        return "I couldn't find any aircraft matching your query. Please try a different search term.";
      }
      
      return foundAircraft.map(aircraft => 
        `${aircraft.tailNumber} (${aircraft.model}):\n` +
        `• Status: ${aircraft.status}\n` +
        `• Location: ${aircraft.location.latitude.toFixed(4)}, ${aircraft.location.longitude.toFixed(4)}\n`
      ).join('\n');
    }

    // Handle status queries
    if (normalizedQuery.includes('status') || normalizedQuery.includes('condition')) {
      if (normalizedQuery.includes('all') || normalizedQuery.includes('fleet')) {
        return getFleetSummary();
      }
      
      const searchTerms = normalizedQuery.split(' ').filter(term => 
        !['status', 'what', 'is', 'the', 'condition', 'of'].includes(term)
      );
      
      const foundAircraft = findAircraft(searchTerms.join(' '));
      
      if (foundAircraft.length === 0) {
        return "I couldn't find any aircraft matching your query. Please try a different search term.";
      }
      
      return foundAircraft.map(aircraft => 
        `${aircraft.tailNumber} is currently ${aircraft.status}`
      ).join('\n');
    }

    // Handle recent changes query
    if (normalizedQuery.includes('recent') || normalizedQuery.includes('changes') || normalizedQuery.includes('updates')) {
      return getRecentChanges();
    }

    // Handle metrics/summary query
    if (normalizedQuery.includes('summary') || normalizedQuery.includes('metrics') || normalizedQuery.includes('overview')) {
      return getFleetSummary();
    }

    // Handle help query
    if (normalizedQuery.includes('help') || normalizedQuery.includes('what can you do')) {
      return `I can help you with:\n` +
             `• Locating aircraft (e.g., "Where is N12345?")\n` +
             `• Checking status (e.g., "What's the status of Boeing 737?")\n` +
             `• Fleet metrics (e.g., "Show fleet summary")\n` +
             `• Recent changes (e.g., "Show recent updates")\n` +
             `Just ask me what you'd like to know!`;
    }

    return "I can help you locate aircraft, check status, and provide fleet metrics. Try asking something like:\n" +
           "• Where is N12345?\n" +
           "• What's the status of the Boeing 737?\n" +
           "• Show me the fleet summary\n" +
           "• Any recent changes?";
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 space-x-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                >
                  Send
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 