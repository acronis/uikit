import { useState } from 'react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  SecondaryMenu,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
} from '@acronis-platform/shadcn-uikit/react'
import {
  CalendarIcon,
  HideIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  ShowIcon,
  UserIcon,
} from '@acronis-platform/shadcn-uikit'
import { CreditCardIcon } from '@/components/icons/missing-icons'
type DemoSection =
  | 'basic'
  | 'types'
  | 'labels'
  | 'icons'
  | 'states'
  | 'validation'
  | 'sizes'
  | 'password'

export function InputDemoWithSecondaryMenu() {
  const [activeSection, setActiveSection] = useState<DemoSection>('basic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [search, setSearch] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex h-full">
      <SecondaryMenu>
        <SecondaryMenuContent>
          <SecondaryMenuGroup title="Input Demos">
            <SecondaryMenuItem
              active={activeSection === 'basic'}
              onClick={() => setActiveSection('basic')}
            >
              Basic Input
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeSection === 'types'}
              onClick={() => setActiveSection('types')}
            >
              Input Types
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeSection === 'labels'}
              onClick={() => setActiveSection('labels')}
            >
              With Labels
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeSection === 'icons'}
              onClick={() => setActiveSection('icons')}
              icon={<MailIcon className="h-4 w-4" />}
            >
              With Icons
            </SecondaryMenuItem>
          </SecondaryMenuGroup>

          <SecondaryMenuGroup title="States">
            <SecondaryMenuItem
              active={activeSection === 'states'}
              onClick={() => setActiveSection('states')}
            >
              Disabled State
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeSection === 'validation'}
              onClick={() => setActiveSection('validation')}
            >
              Validation
            </SecondaryMenuItem>
          </SecondaryMenuGroup>

          <SecondaryMenuGroup title="Advanced">
            <SecondaryMenuItem
              active={activeSection === 'sizes'}
              onClick={() => setActiveSection('sizes')}
            >
              Different Sizes
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={activeSection === 'password'}
              onClick={() => setActiveSection('password')}
              icon={<LockIcon className="h-4 w-4" />}
              tag="NEW"
            >
              Password Input
            </SecondaryMenuItem>
          </SecondaryMenuGroup>
        </SecondaryMenuContent>
      </SecondaryMenu>

      <div className="flex-1 overflow-y-auto">
        <section className="demo-section">
          {activeSection === 'basic' && (
            <>
              <h2>Basic Input</h2>
              <p className="demo-description">
                Simple input fields with placeholder text and default values.
              </p>
              <div className="demo-grid">
                <div className="demo-item">
                  <h3>Default Input</h3>
                  <div className="space-y-4">
                    <Input placeholder="Enter text..." />
                    <Input placeholder="With default value" defaultValue="Default value" />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'types' && (
            <>
              <h2>Input Types</h2>
              <p className="demo-description">
                Different HTML input types for various data formats.
              </p>
              <div className="demo-grid">
                <div className="demo-item">
                  <h3>Various Input Types</h3>
                  <div className="space-y-4">
                    <Input type="text" placeholder="Text input" />
                    <Input type="email" placeholder="Email input" />
                    <Input type="password" placeholder="Password input" />
                    <Input type="number" placeholder="Number input" />
                    <Input type="tel" placeholder="Phone input" />
                    <Input type="url" placeholder="URL input" />
                    <Input type="date" />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'labels' && (
            <>
              <h2>Input with Labels</h2>
              <p className="demo-description">
                Input fields with associated label elements for better accessibility.
              </p>
              <div className="demo-grid">
                <div className="demo-item">
                  <h3>Labeled Inputs</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-[#243143]">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-[#243143]">
                        Password
                      </label>
                      <Input id="password" type="password" placeholder="Enter your password" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium text-[#243143]">
                        Username
                      </label>
                      <Input id="username" type="text" placeholder="Enter username" />
                      <p className="text-xs text-gray-500">Choose a unique username</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'icons' && (
            <>
              <h2>Input with Icons</h2>
              <p className="demo-description">
                Input fields with icon decorations for visual context.
              </p>
              <div className="demo-grid">
                <div className="demo-item">
                  <h3>Icon Inputs</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input className="pl-10" type="email" placeholder="Email" />
                    </div>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input className="pl-10" type="password" placeholder="Password" />
                    </div>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input className="pl-10" type="search" placeholder="Search..." />
                    </div>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input className="pl-10" type="text" placeholder="Full Name" />
                    </div>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input className="pl-10" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="relative">
                      <CreditCardIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input className="pl-10" type="text" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input className="pl-10" type="date" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'states' && (
            <>
              <h2>Disabled State</h2>
              <p className="demo-description">
                Input fields in disabled state that cannot be interacted with.
              </p>
              <div className="demo-grid">
                <div className="demo-item">
                  <h3>Disabled Inputs</h3>
                  <div className="space-y-4">
                    <Input placeholder="Disabled input" disabled />
                    <Input placeholder="Disabled with value" defaultValue="Cannot edit this" disabled />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'validation' && (
            <>
              <h2>Validation States</h2>
              <p className="demo-description">
                Input fields with validation feedback and error messages.
              </p>
              <div className="demo-grid">
                <div className="demo-item">
                  <h3>Required Fields</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="required-name" className="text-sm font-medium text-[#243143]">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input id="required-name" type="text" placeholder="Enter your name" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="required-email" className="text-sm font-medium text-[#243143]">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="required-email"
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="demo-item">
                  <h3>Error State</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="error-email" className="text-sm font-medium text-[#243143]">
                        Email
                      </label>
                      <Input
                        id="error-email"
                        type="email"
                        placeholder="Enter your email"
                        className="border-red-500 focus-visible:border-red-500"
                      />
                      <p className="text-xs text-red-500">Please enter a valid email address</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="error-password" className="text-sm font-medium text-[#243143]">
                        Password
                      </label>
                      <Input
                        id="error-password"
                        type="password"
                        placeholder="Enter your password"
                        className="border-red-500 focus-visible:border-red-500"
                      />
                      <p className="text-xs text-red-500">Password must be at least 8 characters</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'sizes' && (
            <>
              <h2>Different Sizes</h2>
              <p className="demo-description">
                Input fields in various sizes for different use cases.
              </p>
              <div className="demo-grid">
                <div className="demo-item">
                  <h3>Size Variants</h3>
                  <div className="space-y-4">
                    <Input className="h-10 text-sm" placeholder="Small input (40px)" />
                    <Input placeholder="Default input (48px)" />
                    <Input className="h-14 text-base" placeholder="Large input (56px)" />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'password' && (
            <>
              <h2>Password Input</h2>
              <p className="demo-description">
                Password input with visibility toggle functionality.
              </p>
              <div className="demo-grid">
                <div className="demo-item">
                  <h3>Password with Toggle</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="pwd-toggle" className="text-sm font-medium text-[#243143]">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="pwd-toggle"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2668C5] hover:text-[#1a4d8f] transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <ShowIcon className="h-4 w-4" /> : <HideIcon className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="demo-item">
                  <h3>Form Example</h3>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault()
                      alert(`Form submitted!\nEmail: ${email}\nPassword: ${password}`)
                    }}
                  >
                    <div className="space-y-2">
                      <label htmlFor="form-email" className="text-sm font-medium text-[#243143]">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          id="form-email"
                          className="pl-10"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="form-password" className="text-sm font-medium text-[#243143]">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          id="form-password"
                          className="pl-10"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                  </form>
                </div>

                <div className="demo-item">
                  <h3>Search Input</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        className="pl-10"
                        type="search"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    {search && (
                      <p className="text-sm text-gray-600">
                        Searching for: <strong>{search}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
