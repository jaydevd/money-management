const { TRANSACTION_TYPE, USER_TYPE } = require('./constants');

const COMMON_RULES = {
    ID: "required|integer",
    NAME: "required|string|max:100",
    EMAIL: 'required|string|max:100',
    PASSWORD: "required|max:60",
    TOKEN: "string|max:200",
    DATE: 'required|integer',
    AMOUNT: 'required|numeric|min:1',
    TEXT: 'string'
}

const VALIDATION_RULES = {
    USER: {
        ID: COMMON_RULES.ID,
        NAME: COMMON_RULES.NAME,
        EMAIL: COMMON_RULES.EMAIL,
        SURNAME: 'string|max:100',
        ADDRESS: COMMON_RULES.TEXT,
        TOKEN: COMMON_RULES.TOKEN,
        TYPE: `required|string|in:${Object.values(USER_TYPE).join(',')}`,
        INTEREST_RATE: 'required|numeric'
    },
    TRANSACTION: {
        ID: COMMON_RULES.ID,
        USER_ID: COMMON_RULES.ID,
        TYPE: `string|in:${Object.values(TRANSACTION_TYPE).join(',')}`,
        DATE: COMMON_RULES.DATE,
        NOTES: COMMON_RULES.TEXT,
        AMOUNT: COMMON_RULES.AMOUNT
    },
    USER_BALANCE: {
        USER_ID: 'required|integer|unique',
        TOTAL_AMOUNT: COMMON_RULES.AMOUNT,
        AMOUNT_PAID: COMMON_RULES.AMOUNT,
        AMOUNT_RECEIVED: COMMON_RULES.AMOUNT,
        REMAINING_AMOUNT: COMMON_RULES.AMOUNT
    },
    ADMIN: {
        ID: COMMON_RULES.ID,
        NAME: COMMON_RULES.NAME,
        SURNAME: 'string|max:100',
        EMAIL: COMMON_RULES.EMAIL,
        PASSWORD: COMMON_RULES.PASSWORD,
        TOKEN: COMMON_RULES.TOKEN
    }
}

module.exports = { VALIDATION_RULES }