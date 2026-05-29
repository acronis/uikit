import type { Skill } from '../types'

export const mockSkills: Skill[] = [
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    expanded: false,
    children: [
      {
        id: 'threat-analysis',
        name: 'Threat analysis',
        expanded: false,
      },
      {
        id: 'incident-response',
        name: 'Incident response',
        expanded: false,
      },
      {
        id: 'penetration-testing',
        name: 'Penetration testing',
        expanded: false,
      },
    ],
  },
  {
    id: 'cloud-infrastructure',
    name: 'Cloud infrastructure',
    expanded: false,
    children: [
      {
        id: 'aws-architecture',
        name: 'AWS architecture',
        expanded: false,
      },
      {
        id: 'azure-deployment',
        name: 'Azure deployment',
        expanded: false,
      },
      {
        id: 'kubernetes',
        name: 'Kubernetes',
        expanded: false,
      },
    ],
  },
  {
    id: 'data-protection',
    name: 'Data protection',
    expanded: false,
    children: [
      {
        id: 'backup-strategies',
        name: 'Backup strategies',
        expanded: false,
      },
      {
        id: 'disaster-recovery',
        name: 'Disaster recovery',
        expanded: false,
      },
      {
        id: 'encryption',
        name: 'Encryption',
        expanded: false,
      },
    ],
  },
  {
    id: 'compliance',
    name: 'Compliance',
    expanded: false,
    children: [
      {
        id: 'gdpr',
        name: 'GDPR',
        expanded: false,
      },
      {
        id: 'hipaa',
        name: 'HIPAA',
        expanded: false,
      },
      {
        id: 'soc2',
        name: 'SOC 2',
        expanded: false,
      },
    ],
  },
  {
    id: 'automation',
    name: 'Automation',
    expanded: false,
    children: [
      {
        id: 'scripting',
        name: 'Scripting',
        expanded: false,
      },
      {
        id: 'ci-cd',
        name: 'CI/CD',
        expanded: false,
      },
      {
        id: 'infrastructure-as-code',
        name: 'Infrastructure as Code',
        expanded: false,
      },
    ],
  },
]
