import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Input,
  Button,
} from '@acronis-platform/shadcn-uikit/react'
import { useChatFlowStore } from '../store/useChatFlowStore'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useChatFlowStore((state) => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = () => {
    login()
    navigate('/demo/cyberchat-flow/app')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignIn()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
      <Card className="w-full max-w-[440px] shadow-xs border border-gray-200 rounded-2xl">
        <CardContent className="pt-10 pb-8 px-10">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-base">
              <span className="font-semibold text-foreground">Acronis </span>
              <span className="font-normal text-[#0D7DE5]">CyberChat</span>
            </h1>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Corporate email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-10 rounded-lg border-gray-300"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-10 rounded-lg border-gray-300"
            />
            <Button
              className="w-full h-10 rounded-lg bg-[#0D7DE5] hover:bg-[#0B6FD1] mt-4"
              onClick={handleSignIn}
            >
              Sign in
            </Button>
          </div>

          {/* SSO Link */}
          <div className="text-center mt-5">
            <button className="text-sm text-[#0D7DE5] hover:underline">
              Sign in using SSO
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
