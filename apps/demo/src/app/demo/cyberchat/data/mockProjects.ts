import type { Project } from '../types'

export const mockProjects: Project[] = [
  {
    id: 'network-infrastructure',
    name: 'Network infrastructure',
    expanded: true,
    children: [
      {
        id: 'vpn-configuration-guide',
        name: 'VPN configuration guide',
        expanded: false,
      },
      {
        id: 'firewall-policies',
        name: 'Firewall policies',
        expanded: false,
      },
      {
        id: 'dlp-january-audit',
        name: 'DLP January audit',
        expanded: false,
      },
    ],
  },
  {
    id: '2025-wrapped-overview',
    name: '2025 Wrapped overview',
    expanded: false,
    children: [
      {
        id: 'annual-metrics',
        name: 'Annual metrics',
        expanded: false,
      },
      {
        id: 'team-achievements',
        name: 'Team achievements',
        expanded: false,
      },
    ],
  },
  {
    id: 'agent-skill-tree',
    name: 'Agent skill tree',
    expanded: false,
    children: [
      {
        id: 'technical-skills',
        name: 'Technical skills',
        expanded: false,
      },
      {
        id: 'soft-skills',
        name: 'Soft skills',
        expanded: false,
      },
      {
        id: 'certifications',
        name: 'Certifications',
        expanded: false,
      },
    ],
  },
  {
    id: 'product-roadmap',
    name: 'Product roadmap',
    expanded: false,
    children: [
      {
        id: 'q1-2025',
        name: 'Q1 2025',
        expanded: false,
      },
      {
        id: 'q2-2025',
        name: 'Q2 2025',
        expanded: false,
      },
    ],
  },
  {
    id: 'customer-success',
    name: 'Customer success',
    expanded: false,
    children: [
      {
        id: 'onboarding-playbook',
        name: 'Onboarding playbook',
        expanded: false,
      },
      {
        id: 'escalation-procedures',
        name: 'Escalation procedures',
        expanded: false,
      },
    ],
  },
]
