import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Send, X, Bot, User, Lightbulb, BookOpen, Zap } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'suggestion'
}

interface ChatBotProps {
  isOpen: boolean
  onToggle: () => void
}

export const ChatBot = ({ isOpen, onToggle }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm EcoBot, your climate learning assistant! 🌱 I'm here to help you with any questions about climate science, renewable energy, or environmental topics. What would you like to learn about today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickSuggestions = [
    { text: "What causes climate change?", icon: Lightbulb },
    { text: "Play the quiz game", icon: Zap },
    { text: "Explain the greenhouse effect", icon: BookOpen },
    { text: "What can I do to help?", icon: User }
  ]

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Climate change basics
    if (lowerMessage.includes('climate change') || lowerMessage.includes('global warming')) {
      return "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, human activities since the 1800s have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil, and gas. This releases greenhouse gases that trap heat in our atmosphere. Would you like to know more about greenhouse gases or their effects?"
    }
    
    // Greenhouse effect
    if (lowerMessage.includes('greenhouse') || lowerMessage.includes('greenhouse effect')) {
      return "The greenhouse effect is a natural process where certain gases in Earth's atmosphere trap heat from the sun, keeping our planet warm enough to support life. However, human activities have increased the concentration of these gases (like CO2, methane, and nitrous oxide), intensifying this effect and causing global temperatures to rise. Think of it like a blanket around Earth - the thicker the blanket, the warmer it gets!"
    }
    
    // Solar energy
    if (lowerMessage.includes('solar') || lowerMessage.includes('solar panel')) {
      return "Solar panels work through the photovoltaic effect! They contain silicon cells that convert sunlight directly into electricity. When photons from sunlight hit the solar cells, they knock electrons loose, creating an electric current. Solar energy is clean, renewable, and becoming increasingly affordable. It's one of the fastest-growing energy sources worldwide! Want to learn about other renewable energy sources?"
    }
    
    // Renewable energy
    if (lowerMessage.includes('renewable') || lowerMessage.includes('wind') || lowerMessage.includes('hydroelectric')) {
      return "Renewable energy comes from sources that naturally replenish themselves! The main types include: ☀️ Solar (from sunlight), 💨 Wind (from air movement), 💧 Hydroelectric (from flowing water), 🌍 Geothermal (from Earth's heat), and 🌱 Biomass (from organic materials). These sources produce little to no greenhouse gas emissions and are key to fighting climate change!"
    }
    
    // What can I do
    if (lowerMessage.includes('what can i do') || lowerMessage.includes('help') || lowerMessage.includes('action')) {
      return "Great question! Here are some impactful actions you can take: 🚗 Use public transport, bike, or walk when possible, 💡 Switch to LED bulbs and unplug devices when not in use, ♻️ Reduce, reuse, and recycle, 🌱 Eat more plant-based meals, 🏠 Improve home insulation, 🎮 Test your knowledge with our climate quiz game, and most importantly - keep learning and share your knowledge with others! Every small action counts when we all work together."
    }
    
    // Game/quiz related
    if (lowerMessage.includes('game') || lowerMessage.includes('quiz') || lowerMessage.includes('play')) {
      return "Want to test your climate knowledge? Try our interactive Climate Quiz Game! 🎮 You can choose between Quick Quiz (5 questions) or Challenge Mode (8 questions). It's a fun way to reinforce what you've learned and earn points. The game covers topics like renewable energy, waste management, and climate science. Ready to become a Climate Champion? 🏆"
    }
    
    // Waste management
    if (lowerMessage.includes('waste') || lowerMessage.includes('recycle') || lowerMessage.includes('plastic')) {
      return "Waste management is crucial for environmental protection! The 3 R's are key: Reduce (use less), Reuse (find new purposes), and Recycle (process into new materials). Plastic pollution is a major issue - it takes hundreds of years to decompose and harms marine life. Try using reusable bags, bottles, and containers. Composting organic waste also reduces methane emissions from landfills!"
    }
    
    // Ecosystems
    if (lowerMessage.includes('ecosystem') || lowerMessage.includes('biodiversity') || lowerMessage.includes('forest')) {
      return "Ecosystems are communities of living organisms interacting with their environment. They provide essential services like clean air and water, climate regulation, and food production. Biodiversity (variety of life) makes ecosystems more resilient. Forests are particularly important - they absorb CO2, produce oxygen, and house 80% of terrestrial biodiversity. Protecting ecosystems is vital for both wildlife and human well-being!"
    }
    
    // Default response
    return "That's an interesting question! While I'd love to help with that specific topic, I'm focused on climate science and environmental education. Try asking me about climate change, renewable energy, waste management, ecosystems, or our quiz game. You can also check out our lesson modules for comprehensive learning on these topics! 📚"
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(content),
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-nature-primary to-nature-secondary hover:shadow-xl transition-all duration-300 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col chatbot-container">
      <CardHeader className="bg-gradient-to-r from-nature-primary to-nature-secondary text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">EcoBot</CardTitle>
              <p className="text-xs opacity-90">Climate Learning Assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4 max-h-[350px] chatbot-scroll-area">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-nature-primary text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-nature-primary" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-nature-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-nature-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-nature-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-nature-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="text-xs h-auto p-2 justify-start"
                >
                  <suggestion.icon className="h-3 w-3 mr-1" />
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t chatbot-input-area">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about climate science..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(inputValue)
                }
              }}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}