export enum AIModel {
    CODEX = 'codex',
    GPT35_TURBO = 'gpt-3.5-turbo',
    GPT4 = 'gpt-4',
    GPT4_TURBO = 'gpt-4-turbo',
    GPT4O = 'gpt-4o',
    GPT41 = 'gpt-4.1',
    GPT5_MINI = 'gpt-5-mini',
    GPT5 = 'gpt-5',
    GPT5_CODEX = 'gpt-5-codex',
    
    O3_MINI = 'o3-mini',
    O4_MINI = 'o4-mini',
    
    CLAUDE_SONNET_35 = 'claude-sonnet-3.5',
    CLAUDE_SONNET_37 = 'claude-sonnet-3.7',
    CLAUDE_SONNET_37_THINKING = 'claude-sonnet-3.7-thinking',
    CLAUDE_SONNET_4 = 'claude-sonnet-4',
    CLAUDE_SONNET_45 = 'claude-sonnet-4.5',
    
    GEMINI_2_FLASH = 'gemini-2.0-flash',
    GEMINI_25_PRO = 'gemini-2.5-pro',
    
    GROK_CODE_FAST_1 = 'grok-code-fast-1'
}

export enum ModelProvider {
    OPENAI = 'OpenAI',
    ANTHROPIC = 'Anthropic',
    GOOGLE = 'Google',
    XAI = 'xAI'
}

export interface ModelSpec {
    id: AIModel;
    provider: ModelProvider;
    name: string;
    description: string;
    energyPer1kTokens: number; // kWh per 1000 tokens
    averageTokensPerSuggestion: number;
    releaseDate: string;
    features: string[];
    notes?: string;
}

export const MODEL_SPECS: Record<AIModel, ModelSpec> = {
    [AIModel.CODEX]: {
        id: AIModel.CODEX,
        provider: ModelProvider.OPENAI,
        name: 'Codex',
        description: 'Original GitHub Copilot (GPT-3 based)',
        energyPer1kTokens: 0.0004,
        averageTokensPerSuggestion: 50,
        releaseDate: '2021-06',
        features: ['code-completion'],
        notes: 'Legacy model, still used by some older Copilot versions'
    },
    
    [AIModel.GPT35_TURBO]: {
        id: AIModel.GPT35_TURBO,
        provider: ModelProvider.OPENAI,
        name: 'GPT-3.5 Turbo',
        description: 'GitHub Copilot (GPT-3.5-turbo)',
        energyPer1kTokens: 0.0006,
        averageTokensPerSuggestion: 75,
        releaseDate: '2023-03',
        features: ['code-completion', 'chat'],
        notes: 'Common default for many Copilot users'
    },
    
    [AIModel.GPT4]: {
        id: AIModel.GPT4,
        provider: ModelProvider.OPENAI,
        name: 'GPT-4',
        description: 'GitHub Copilot Chat (GPT-4)',
        energyPer1kTokens: 0.0015,
        averageTokensPerSuggestion: 150,
        releaseDate: '2023-03',
        features: ['code-completion', 'chat', 'reasoning'],
        notes: 'Higher capability but higher energy cost'
    },
    
    [AIModel.GPT4_TURBO]: {
        id: AIModel.GPT4_TURBO,
        provider: ModelProvider.OPENAI,
        name: 'GPT-4 Turbo',
        description: 'GitHub Copilot (GPT-4 Turbo)',
        energyPer1kTokens: 0.0012,
        averageTokensPerSuggestion: 150,
        releaseDate: '2023-11',
        features: ['code-completion', 'chat', 'reasoning', 'vision'],
        notes: 'More efficient than GPT-4'
    },
    
    [AIModel.GPT4O]: {
        id: AIModel.GPT4O,
        provider: ModelProvider.OPENAI,
        name: 'GPT-4o',
        description: 'GitHub Copilot (GPT-4o - Omni)',
        energyPer1kTokens: 0.0010,
        averageTokensPerSuggestion: 120,
        releaseDate: '2024-05',
        features: ['code-completion', 'chat', 'multimodal'],
        notes: 'Optimized for speed and efficiency'
    },
    
    [AIModel.GPT41]: {
        id: AIModel.GPT41,
        provider: ModelProvider.OPENAI,
        name: 'GPT-4.1',
        description: 'GitHub Copilot (GPT-4.1)',
        energyPer1kTokens: 0.0011,
        averageTokensPerSuggestion: 130,
        releaseDate: '2024-10',
        features: ['code-completion', 'chat', 'reasoning', 'vision'],
        notes: 'Incremental improvement over GPT-4o'
    },
    
    [AIModel.GPT5_MINI]: {
        id: AIModel.GPT5_MINI,
        provider: ModelProvider.OPENAI,
        name: 'GPT-5 Mini',
        description: 'Lightweight GPT-5 variant',
        energyPer1kTokens: 0.0008,
        averageTokensPerSuggestion: 100,
        releaseDate: '2025-01',
        features: ['code-completion', 'chat', 'fast-inference'],
        notes: 'Balanced performance and efficiency'
    },
    
    [AIModel.GPT5]: {
        id: AIModel.GPT5,
        provider: ModelProvider.OPENAI,
        name: 'GPT-5',
        description: 'Next-generation GPT model',
        energyPer1kTokens: 0.0018,
        averageTokensPerSuggestion: 200,
        releaseDate: '2025-03',
        features: ['code-completion', 'chat', 'advanced-reasoning', 'multimodal'],
        notes: 'Estimated - most capable but energy intensive'
    },
    
    [AIModel.GPT5_CODEX]: {
        id: AIModel.GPT5_CODEX,
        provider: ModelProvider.OPENAI,
        name: 'GPT-5 Codex',
        description: 'Code-specialized GPT-5',
        energyPer1kTokens: 0.0014,
        averageTokensPerSuggestion: 180,
        releaseDate: '2025-04',
        features: ['code-completion', 'code-analysis', 'debugging'],
        notes: 'Estimated - optimized for coding tasks'
    },
    
    [AIModel.O3_MINI]: {
        id: AIModel.O3_MINI,
        provider: ModelProvider.OPENAI,
        name: 'o3-mini',
        description: 'Lightweight reasoning model',
        energyPer1kTokens: 0.0009,
        averageTokensPerSuggestion: 90,
        releaseDate: '2024-12',
        features: ['reasoning', 'problem-solving', 'code-completion'],
        notes: 'Efficient reasoning for coding tasks'
    },
    
    [AIModel.O4_MINI]: {
        id: AIModel.O4_MINI,
        provider: ModelProvider.OPENAI,
        name: 'o4-mini',
        description: 'Advanced compact reasoning model',
        energyPer1kTokens: 0.0010,
        averageTokensPerSuggestion: 100,
        releaseDate: '2025-02',
        features: ['advanced-reasoning', 'code-completion', 'debugging'],
        notes: 'Enhanced reasoning capabilities'
    },
    
    [AIModel.CLAUDE_SONNET_35]: {
        id: AIModel.CLAUDE_SONNET_35,
        provider: ModelProvider.ANTHROPIC,
        name: 'Claude Sonnet 3.5',
        description: 'Anthropic Claude 3.5 Sonnet',
        energyPer1kTokens: 0.0008,
        averageTokensPerSuggestion: 110,
        releaseDate: '2024-06',
        features: ['code-completion', 'chat', 'analysis'],
        notes: 'Balanced performance and efficiency'
    },
    
    [AIModel.CLAUDE_SONNET_37]: {
        id: AIModel.CLAUDE_SONNET_37,
        provider: ModelProvider.ANTHROPIC,
        name: 'Claude Sonnet 3.7',
        description: 'Anthropic Claude 3.7 Sonnet',
        energyPer1kTokens: 0.0009,
        averageTokensPerSuggestion: 120,
        releaseDate: '2024-09',
        features: ['code-completion', 'chat', 'advanced-analysis'],
        notes: 'Improved coding capabilities'
    },
    
    [AIModel.CLAUDE_SONNET_37_THINKING]: {
        id: AIModel.CLAUDE_SONNET_37_THINKING,
        provider: ModelProvider.ANTHROPIC,
        name: 'Claude Sonnet 3.7 Thinking',
        description: 'Claude 3.7 with extended thinking',
        energyPer1kTokens: 0.0013,
        averageTokensPerSuggestion: 180,
        releaseDate: '2024-10',
        features: ['deep-reasoning', 'code-analysis', 'problem-solving'],
        notes: 'Extended reasoning for complex problems'
    },
    
    [AIModel.CLAUDE_SONNET_4]: {
        id: AIModel.CLAUDE_SONNET_4,
        provider: ModelProvider.ANTHROPIC,
        name: 'Claude Sonnet 4',
        description: 'Anthropic Claude 4 Sonnet',
        energyPer1kTokens: 0.0010,
        averageTokensPerSuggestion: 130,
        releaseDate: '2024-12',
        features: ['code-completion', 'chat', 'multimodal', 'reasoning'],
        notes: 'Next-generation Claude model'
    },
    
    [AIModel.CLAUDE_SONNET_45]: {
        id: AIModel.CLAUDE_SONNET_45,
        provider: ModelProvider.ANTHROPIC,
        name: 'Claude Sonnet 4.5',
        description: 'Anthropic Claude 4.5 Sonnet',
        energyPer1kTokens: 0.0011,
        averageTokensPerSuggestion: 140,
        releaseDate: '2025-01',
        features: ['advanced-coding', 'reasoning', 'analysis', 'multimodal'],
        notes: 'State-of-the-art coding assistant'
    },
    
    [AIModel.GEMINI_2_FLASH]: {
        id: AIModel.GEMINI_2_FLASH,
        provider: ModelProvider.GOOGLE,
        name: 'Gemini 2.0 Flash',
        description: 'Google Gemini 2.0 Flash',
        energyPer1kTokens: 0.0007,
        averageTokensPerSuggestion: 95,
        releaseDate: '2024-12',
        features: ['code-completion', 'fast-inference', 'multimodal'],
        notes: 'Optimized for speed'
    },
    
    [AIModel.GEMINI_25_PRO]: {
        id: AIModel.GEMINI_25_PRO,
        provider: ModelProvider.GOOGLE,
        name: 'Gemini 2.5 Pro',
        description: 'Google Gemini 2.5 Pro',
        energyPer1kTokens: 0.0016,
        averageTokensPerSuggestion: 170,
        releaseDate: '2025-02',
        features: ['advanced-coding', 'reasoning', 'multimodal', 'long-context'],
        notes: 'Most capable Gemini model'
    },
    
    [AIModel.GROK_CODE_FAST_1]: {
        id: AIModel.GROK_CODE_FAST_1,
        provider: ModelProvider.XAI,
        name: 'Grok Code Fast 1',
        description: 'xAI Grok Code Fast',
        energyPer1kTokens: 0.0009,
        averageTokensPerSuggestion: 105,
        releaseDate: '2024-11',
        features: ['code-completion', 'fast-inference', 'real-time'],
        notes: 'Optimized for speed and real-time coding'
    }
};

export const DEFAULT_MODEL = AIModel.GPT4O;

export function getModelSpec(model: AIModel): ModelSpec {
    return MODEL_SPECS[model];
}

export function getModelsByProvider(provider: ModelProvider): ModelSpec[] {
    return Object.values(MODEL_SPECS).filter(spec => spec.provider === provider);
}

export function getAllModels(): ModelSpec[] {
    return Object.values(MODEL_SPECS);
}

export function getModelsByFeature(feature: string): ModelSpec[] {
    return Object.values(MODEL_SPECS).filter(spec => 
        spec.features.includes(feature)
    );
}