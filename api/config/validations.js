const { TRANSACTION_TYPE, USER_TYPE } = require('./constants');

const COMMON_RULES = {
    ID: "required|integer",
    NAME: "required|string|max:100",
    PASSWORD: "required|max:60",
    TOKEN: "string|max:200",
    AMOUNT: 'required|decimal(10,2)|gt:0'
}

const VALIDATION_RULES = {
    USER: {
        ID: COMMON_RULES.ID,
        NAME: COMMON_RULES.NAME,
        SURNAME: 'max:100',
        ADDRESS: "string|max:255",
        PASSWORD: COMMON_RULES.PASSWORD,
        TOKEN: COMMON_RULES.TOKEN,
        TYPE: `required|string|in:${Object.values(USER_TYPE).join(',')}`,
        INTEREST_RATE: 'required|decimal(10,2)'
    },
    TRANSACTION: {
        ID: COMMON_RULES.ID,
        USER_ID: COMMON_RULES.ID,
        TYPE: `string|in:${Object.values(TRANSACTION_TYPE).join(',')}`,
        DATE: 'required|integer',
        NOTES: 'max:500',
        AMOUNT: 'required|decimal(10,2)|gt:0'
    },
    USER_BALANCE: {
        USER_ID: 'required|integer|unique',
        TOTAL_AMOUNT: COMMON_RULES.AMOUNT,
        AMOUNT_PAID: COMMON_RULES.AMOUNT,
        AMOUNT_RECEIVED: COMMON_RULES.AMOUNT,
        REMAINING_AMOUNT: COMMON_RULES.AMOUNT
    }
}

module.exports = { VALIDATION_RULES }