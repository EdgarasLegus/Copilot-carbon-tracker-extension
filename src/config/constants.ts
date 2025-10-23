// kg CO2e per kWh
export const CARBON_CONSTANTS = {

    //Global average carbon intensity for cloud data centers
    CARBON_INTENSITY_GLOBAL: 0.429,
    
    CARBON_INTENSITY_BY_REGION: {
        US_EAST: 0.385,
        US_WEST: 0.313,
        EU_WEST: 0.295,
        EU_NORTH: 0.008,
        ASIA_PACIFIC: 0.581,
        GLOBAL: 0.429
    },
    
    DEFAULT_REGION: 'GLOBAL' as const
};

export const TOKEN_CONSTANTS = {
    
    // OpenAI standard: ~4 characters = 1 token
    CHARS_PER_TOKEN: 4,

    MIN_SUGGESTION_LENGTH: 10,
    AVERAGE_CODE_SUGGESTION_TOKENS: 75
};

// grams of CO2
export const CO2_COMPARISONS = {

    // Average smartphone battery: 15Wh, charging efficiency: ~85%
    SMARTPHONE_CHARGE: 8,
    
    //Driving a car
    //Average passenger car: 404g CO2 per mile
    CAR_MILE: 404,
    
    // 10W bulb × 1 hour × 0.429 kg CO2/kWh
    LED_BULB_HOUR: 4.3,
    
    // 60 W
    INCANDESCENT_BULB_HOUR: 25.7,
    
    // includes device + network + data center
    HD_STREAMING_HOUR: 55,
    
    // 4K video streaming
    UHD_STREAMING_HOUR: 100,
    
    // Average tree
    TREE_ABSORPTION_DAILY: 57.5,
    TREE_ABSORPTION_YEARLY: 21000,
    
    // Average search
    GOOGLE_SEARCH: 0.2,

    // Email with 1MB attachment
    EMAIL_WITH_ATTACHMENT: 50,

    //Average laptop (50W)
    LAPTOP_HOUR: 21.5,

    //1 liter
    BOIL_WATER_LITER: 70,
    COFFEE_CUP: 21
};

export const UI_THRESHOLDS = {

    LOW_THRESHOLD: 10,
    MEDIUM_THRESHOLD: 50,

    FEW_SUGGESTIONS: 10,
    MANY_SUGGESTIONS: 100,

    // Daily CO2 targets (g)
    DAILY_TARGET_LOW: 20,
    DAILY_TARGET_MEDIUM: 50,
    DAILY_TARGET_HIGH: 100
};


export const TIME_CONSTANTS = {
    ONE_HOUR: 60 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
    ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
    ONE_YEAR: 365 * 24 * 60 * 60 * 1000
};

export const FORMAT_CONSTANTS = {
    DECIMALS: {
        CO2_GRAMS: 2,
        CO2_KG: 2,
        TOKENS: 0,
        PERCENTAGES: 1,
        COMPARISONS: 1
    },
    LOCALE: 'en-US'
};

export function getCarbonIntensity(region?: keyof typeof CARBON_CONSTANTS.CARBON_INTENSITY_BY_REGION): number {
    if (region && region in CARBON_CONSTANTS.CARBON_INTENSITY_BY_REGION) {
        return CARBON_CONSTANTS.CARBON_INTENSITY_BY_REGION[region];
    }
    return CARBON_CONSTANTS.CARBON_INTENSITY_GLOBAL;
}

export function getComparisonValue(type: keyof typeof CO2_COMPARISONS): number {
    return CO2_COMPARISONS[type];
}

export function getUIColor(co2Grams: number): 'green' | 'yellow' | 'red' {
    if (co2Grams < UI_THRESHOLDS.LOW_THRESHOLD) {
        return 'green';
    }
    if (co2Grams < UI_THRESHOLDS.MEDIUM_THRESHOLD) {
        return 'yellow';
    }
    return 'red';
}

export function getUIEmoji(co2Grams: number): string {
    const color = getUIColor(co2Grams);
    switch (color) {
        case 'green': return '🌱';
        case 'yellow': return '🟡';
        case 'red': return '🔴';
    }
}