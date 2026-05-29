import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  SecondaryMenu,
  SecondaryMenuContent,
  SecondaryMenuGroup,
  SecondaryMenuItem,
} from '@acronis-platform/shadcn-uikit/react'
import { ExclamationCircleIcon, MailIcon } from '@acronis-platform/shadcn-uikit'
import { RulerIcon } from '@/components/icons/missing-icons'
export function InputLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname === `/input${path}`
  }

  return (
    <div className="flex h-full">
      <SecondaryMenu>
        <SecondaryMenuContent>
          <SecondaryMenuGroup title="Input Demos">
            <SecondaryMenuItem
              active={isActive('/input') || isActive('/input/basic')}
              onClick={() => navigate('/input/basic')}
            >
              Basic Input
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={isActive('/input/types')}
              onClick={() => navigate('/input/types')}
            >
              Input Types
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={isActive('/input/labels')}
              onClick={() => navigate('/input/labels')}
            >
              With Labels
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={isActive('/input/icons')}
              onClick={() => navigate('/input/icons')}
              icon={<MailIcon className="h-4 w-4" />}
            >
              With Icons
            </SecondaryMenuItem>
          </SecondaryMenuGroup>

          <SecondaryMenuGroup title="States">
            <SecondaryMenuItem
              active={isActive('/input/states')}
              onClick={() => navigate('/input/states')}
            >
              Disabled State
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={isActive('/input/validation')}
              onClick={() => navigate('/input/validation')}
              icon={<ExclamationCircleIcon className="h-4 w-4" />}
            >
              Validation
            </SecondaryMenuItem>
          </SecondaryMenuGroup>

          <SecondaryMenuGroup title="Advanced">
            <SecondaryMenuItem
              active={isActive('/input/sizes')}
              onClick={() => navigate('/input/sizes')}
              icon={<RulerIcon className="h-4 w-4" />}
            >
              Different Sizes
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={isActive('/input/form')}
              onClick={() => navigate('/input/form')}
            >
              Form Example
            </SecondaryMenuItem>
            <SecondaryMenuItem
              active={isActive('/input/search')}
              onClick={() => navigate('/input/search')}
            >
              Search Input
            </SecondaryMenuItem>
          </SecondaryMenuGroup>
        </SecondaryMenuContent>
      </SecondaryMenu>

      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  )
}
