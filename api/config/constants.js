const TRANSACTION_TYPE = {
    BORROWED: 'borrowed',
    LENDED: 'lended',
    PAID: 'paid',
    RECEIVED: 'received'
}

const USER_TYPE = {
    LENDER: 'lender',
    BORROWER: 'borrower'
}

const HTTP_STATUS_CODES = {

    SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: 500,
    },
    CLIENT_ERROR: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404
    },
    REDIRECTION_ERROR: 300,
    SUCCESS: {
        OK: 200,
        CREATED: 201
    },
}

module.exports = {
    TRANSACTION_TYPE,
    USER_TYPE,
    HTTP_STATUS_CODES
}