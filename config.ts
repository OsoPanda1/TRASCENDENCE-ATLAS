/**
 * UTAMV AI Configuration
 * Based on UTAMV-AI-Academic-Core-2026.md
 * Manual de Auditoría, Análisis y Mejora Continua Asistida por IA
 */

/**
 * Core AI Principles according to Manual Section 2
 */
export const AI_PRINCIPLES = {
  // Academic Principles (Section 2.1)
  academic: {
    noInventData: true,                    // No inventa datos
    noUnverifiedAsDefinitive: true,        // No presenta información no verificada como definitiva
    noFakeCredentials: true,               // No emite títulos, certificaciones u oficiales inexistentes
    noSubstituteEvaluation: true,          // No sustituye la evaluación académica
    noEliminateCriticalThinking: true,     // No elimina el pensamiento crítico del estudiante
  },
  
  // Ethical Principles (Section 2.2)
  ethical: {
    transparencyOfScope: true,             // Transparencia del alcance de la IA
    respectIntellectualAutonomy: true,     // Respeto a la autonomía intelectual
    rejectPlagiarism: true,                // Rechazo al plagio y a la automatización fraudulenta
    ideologicalNeutrality: true,           // Neutralidad ideológica y profesional
  },
  
  // Institutional Principles (Section 2.3)
  institutional: {
    respectPreRVOE: true,                  // Respeto absoluto al marco pre-RVOE
    alignmentWithStatute: true,            // Alineación con Estatuto, Reglamento y Modelo Educativo
    protectIntegrity: true,                // Protección de la integridad del estudiante y de la institución
  },
} as const;

/**
 * AI Limits according to Manual Section 10
 */
export const AI_LIMITS = {
  // What AI CAN do
  canDo: [
    'explain-concepts',           // Explicar conceptos y marcos teóricos
    'guide-learning',             // Guiar procesos de aprendizaje
    'compare-approaches',         // Comparar enfoques, metodologías y marcos normativos
    'structure-knowledge',        // Estructurar conocimiento
    'formulate-questions',        // Formular preguntas pedagógicas
    'analyze-patterns',           // Analizar datos y patrones
    'propose-improvements',       // Proponer mejoras
    'detect-inconsistencies',     // Detectar inconsistencias
    'automate-tasks',             // Automatizar tareas operativas
    'generate-reports',           // Generar reportes
  ],
  
  // What AI CANNOT do
  cannotDo: [
    'approve-normative-changes',  // Aprobar cambios normativos
    'modify-content-without-review', // Modificar contenido académico sin revisión
    'interact-as-authority',      // Interactuar con estudiantes como autoridad
    'make-financial-decisions',   // Tomar decisiones financieras
    'substitute-human-decisions', // Sustituir decisiones humanas estratégicas
    'declare-accreditations',     // Declarar acreditaciones
    'modify-normative-unauthorized', // Modificar documentos normativos sin autorización
    'interpret-laws-bindingly',   // Interpretar leyes de forma vinculante
    'access-sensitive-data',      // Acceder a datos sensibles sin autorización
    'make-disciplinary-decisions', // Tomar decisiones disciplinarias
  ],
} as const;

/**
 * Pipeline A - Normative Filter Configuration
 * Based on Manual Section 5
 */
export const PIPELINE_A_CONFIG = {
  // Legal validation layers
  legal: {
    preventAcademicFraud: true,           // Prevenir fraude académico
    preventAuthoritySupplantation: true,  // No suplantación de autoridad profesional
    preventOfficialValiditySimulation: true, // No simulación de validez oficial
  },
  
  // Institutional validation layers
  institutional: {
    coherenceWithStatute: true,           // Coherencia con Estatuto, Reglamento y Aviso Legal Pre-RVOE
    protectInstitutionalImage: true,      // Protección de la imagen institucional
  },
  
  // Educational ethics validation layers
  educationalEthics: {
    noPlagiarismPromotion: true,          // No fomento al plagio
    noEvaluationReplacement: true,        // No reemplazo de procesos evaluativos
    noLearningDamage: true,               // No daño al proceso de aprendizaje
  },
  
  // Possible results
  results: {
    APPROVED: 'approved',
    CONDITIONED: 'conditioned',
    REJECTED: 'rejected',
  } as const,
} as const;

/**
 * Pipeline B - Academic Categorization Configuration
 * Based on Manual Section 6
 */
export const PIPELINE_B_CONFIG = {
  // Academic Areas (Section 6.1.1)
  academicAreas: [
    'tecnologia-avanzada',
    'marketing-estrategico',
    'versatilidad-profesional',
    'etica-legalidad-gobernanza',
    'investigacion-academica',
  ] as const,
  
  // Subjects/Subareas (Section 6.1.2)
  subjects: [
    'inteligencia-artificial-aplicada',
    'seo-aeo',
    'analitica-datos',
    'metodologia-cientifica',
    'etica-tecnologia',
    'gestion-comunidades-digitales',
    'blockchain-metaversos',
  ] as const,
  
  // Cognitive Levels - Bloom Revised (Section 6.1.3)
  cognitiveLevels: [
    'comprension',
    'aplicacion',
    'analisis',
    'evaluacion',
    'diseno-conceptual',
  ] as const,
  
  // Request Types (Section 6.1.4)
  requestTypes: [
    'explicativa',
    'metodologica',
    'comparativa',
    'investigativa',
    'orientativa-profesional',
  ] as const,
} as const;

/**
 * Academic Foundation Types
 * Based on Manual Section 7.1
 */
export const FOUNDATION_TYPES = {
  academicRecognized: {
    name: 'Académico reconocido',
    description: 'Libros, artículos, normas, papers, estándares',
    reliability: 'high',
  },
  institutionalUTAMV: {
    name: 'Institucional UTAMV',
    description: 'Estatuto, reglamentos, modelos educativos, descripciones de programas',
    reliability: 'high',
  },
  internationalStandards: {
    name: 'Estándares internacionales',
    description: 'UNESCO, OCDE, ISO (referencia, no acreditación automática)',
    reliability: 'medium',
  },
  pedagogicalGuidance: {
    name: 'Orientación pedagógica',
    description: 'Guías didácticas alineadas a OBE y Bloom',
    reliability: 'medium',
  },
} as const;

/**
 * Orchestrator Configuration
 * Based on Manual Section 8
 */
export const ORCHESTRATOR_CONFIG = {
  // Decision criteria
  decisions: {
    library: {
      internal: 'internal-utamv',
      external: 'external-frames',
      mixed: 'mixed',
    },
    depth: {
      basic: 'basic',
      intermediate: 'intermediate',
      advanced: 'advanced',
    },
    tone: {
      tutorial: 'tutorial',
      analytical: 'analytical',
      comparative: 'comparative',
      reflective: 'reflective',
    },
    humanIntervention: {
      required: 'required',
      suggested: 'suggested',
      notNeeded: 'not-needed',
    },
  },
  
  // Context-based approach mapping
  contextApproach: {
    sensitiveTopic: {
      tone: 'reflective',
      warnings: true,
      humanIntervention: 'suggested',
    },
    technicalTopic: {
      tone: 'tutorial',
      warnings: false,
      humanIntervention: 'not-needed',
    },
    legalRisk: {
      tone: 'analytical',
      warnings: true,
      humanIntervention: 'required',
    },
  },
} as const;

/**
 * Content Types Classification
 * Based on Manual Section 6.3
 */
export type ContentType = 
  | 'peer-reviewed'      // Arbitrado externamente
  | 'internal-research'  // Investigación interna
  | 'educational'        // Material didáctico
  | 'opinion'            // Opinión o análisis
  | 'news'               // Noticia institucional
  | 'promotional';       // Contenido promocional

export const CONTENT_TYPE_CONFIG: Record<ContentType, {
  label: string;
  disclaimer?: string;
  peerReviewed: boolean;
}> = {
  'peer-reviewed': {
    label: 'Arbitrado externamente',
    peerReviewed: true,
  },
  'internal-research': {
    label: 'Investigación interna',
    disclaimer: 'Este contenido es investigación interna y no ha sido sometido a revisión por pares externos.',
    peerReviewed: false,
  },
  'educational': {
    label: 'Material didáctico',
    peerReviewed: false,
  },
  'opinion': {
    label: 'Opinión o análisis',
    disclaimer: 'Este contenido refleja opiniones y análisis, no constituye investigación científica arbitrada.',
    peerReviewed: false,
  },
  'news': {
    label: 'Noticia institucional',
    peerReviewed: false,
  },
  'promotional': {
    label: 'Contenido promocional',
    disclaimer: 'Este es contenido promocional institucional.',
    peerReviewed: false,
  },
};

/**
 * Pre-RVOE Disclaimer
 * Must be included in relevant responses
 */
export const PRE_RVOE_DISCLAIMER = `
**Aviso importante**: UTAMV es una institución privada en fase pre-RVOE. 
Ningún programa posee reconocimiento de validez oficial salvo resolución expresa 
emitida por autoridad educativa competente.
`;

/**
 * AI Response Disclaimer
 * Must be included when appropriate
 */
export const AI_RESPONSE_DISCLAIMER = `
**Nota**: Esta respuesta tiene carácter orientativo y pedagógico. 
No constituye asesoría profesional, dictamen jurídico ni evaluación académica oficial.
`;

/**
 * Action types that require approval
 * Based on Manual Section 10.3
 */
export interface AIAction {
  type: 'analysis' | 'suggestion' | 'automation' | 'alert';
  requiresApproval: boolean;
  approvalLevel?: 'admin' | 'academic' | 'legal' | 'executive';
  autoExecute: boolean;
}

export const AI_ACTION_CONFIG: Record<string, AIAction> = {
  // Analysis actions - auto execute
  'analyze-structure': {
    type: 'analysis',
    requiresApproval: false,
    autoExecute: true,
  },
  'analyze-navigation': {
    type: 'analysis',
    requiresApproval: false,
    autoExecute: true,
  },
  'analyze-content': {
    type: 'analysis',
    requiresApproval: false,
    autoExecute: true,
  },
  
  // Suggestion actions - no auto execute
  'suggest-improvement': {
    type: 'suggestion',
    requiresApproval: false,
    autoExecute: false,
  },
  'suggest-content-change': {
    type: 'suggestion',
    requiresApproval: true,
    approvalLevel: 'academic',
    autoExecute: false,
  },
  'suggest-structure-change': {
    type: 'suggestion',
    requiresApproval: true,
    approvalLevel: 'admin',
    autoExecute: false,
  },
  
  // Automation actions - require approval
  'automate-report': {
    type: 'automation',
    requiresApproval: false,
    autoExecute: true,
  },
  'automate-notification': {
    type: 'automation',
    requiresApproval: true,
    approvalLevel: 'admin',
    autoExecute: false,
  },
  
  // Alert actions - auto execute
  'alert-issue': {
    type: 'alert',
    requiresApproval: false,
    autoExecute: true,
  },
  'alert-critical': {
    type: 'alert',
    requiresApproval: false,
    autoExecute: true,
  },
};

/**
 * Reporting configuration
 */
export const REPORTING_CONFIG = {
  frequency: 'weekly' as const,
  channels: ['dashboard', 'email'] as const,
  includeMetrics: true,
  includeProposals: true,
  includeAuditLog: true,
};

/**
 * Full AI Configuration Object
 */
export const AI_CONFIG = {
  principles: AI_PRINCIPLES,
  limits: AI_LIMITS,
  pipelineA: PIPELINE_A_CONFIG,
  pipelineB: PIPELINE_B_CONFIG,
  foundationTypes: FOUNDATION_TYPES,
  orchestrator: ORCHESTRATOR_CONFIG,
  contentTypes: CONTENT_TYPE_CONFIG,
  actions: AI_ACTION_CONFIG,
  reporting: REPORTING_CONFIG,
  disclaimers: {
    preRVOE: PRE_RVOE_DISCLAIMER,
    aiResponse: AI_RESPONSE_DISCLAIMER,
  },
};

export default AI_CONFIG;
